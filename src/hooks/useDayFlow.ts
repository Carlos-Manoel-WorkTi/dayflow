import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { Activity, Tag, DayProcess, CommitmentData } from "@/types";
import { loginTestUser } from "../config/firebase";
import { deleteDoc } from "firebase/firestore";
// Gerar IDs aleatórios
const generateId = () => Math.random().toString(36).substr(2, 9);

// Tags padrão
const defaultTags: Tag[] = [
  { id: "1", name: "Trabalho", color: "#8B5CF6" },
  { id: "2", name: "Estudo", color: "#06B6D4" },
  { id: "3", name: "Exercício", color: "#10B981" },
  { id: "4", name: "Lazer", color: "#F59E0B" },
  { id: "5", name: "Família", color: "#EF4444" },
  { id: "6", name: "Saúde", color: "#EC4899" },
  { id: "7", name: "Financeiro", color: "#FBBF24" },
  { id: "8", name: "Projetos", color: "#3B82F6" },
  { id: "9", name: "Compras", color: "#6366F1" },
  { id: "10", name: "Tarefas Domésticas", color: "#22C55E" },
];

export function useDayFlow() {
  const [dayProcesses, setDayProcesses] = useState<DayProcess[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>(defaultTags);
  const [currentDay, setCurrentDay] = useState<DayProcess | null>(null);

  const daysCol = collection(db, "dias");
  const tagsDoc = doc(db, "meta", "tags");

  // Carregar dados do Firestore
  useEffect(() => {
    async function fetchData() {
      try {
        await loginTestUser();

        // Carregar tags
        const tagsSnap = await getDoc(tagsDoc);
        if (tagsSnap.exists()) {
          const data = tagsSnap.data();
          if (data.tags && Array.isArray(data.tags)) setAvailableTags(data.tags);
        }

        // Carregar dias
        const snapshot = await getDocs(daysCol);
        const dias: DayProcess[] = snapshot.docs.map(d => d.data() as DayProcess);
        setDayProcesses(dias);

        // Selecionar o último dia não finalizado ou o último dia criado
        const lastDay = dias
          .sort((a, b) => b.date.localeCompare(a.date))
          .find(d => !d.finalizado) || dias[dias.length - 1];

        if (lastDay) setCurrentDay(lastDay);
      } catch (err) {
        console.error("Erro ao carregar dados do Firestore:", err);
      }
    }
    fetchData();
  }, []);

  // Salvar tags
  const saveTags = async (tags: Tag[]) => {
    setAvailableTags(tags);
    await setDoc(tagsDoc, { tags });
  };

  // Salvar ou atualizar dia
  const saveDay = async (day: DayProcess) => {
    setCurrentDay(day);
    setDayProcesses(prev =>
      prev.some(d => d.id === day.id)
        ? prev.map(d => (d.id === day.id ? day : d))
        : [...prev, day]
    );
    await setDoc(doc(daysCol, day.date), day);
  };

  // Criar novo dia (data opcional)
  const createNewDay = async (date?: string) => {
    const dayDate = date || new Date().toISOString().split("T")[0];
    const existingDay = dayProcesses.find(p => p.date === dayDate);
    if (existingDay) {
      setCurrentDay(existingDay);
      return existingDay;
    }

    const newDay: DayProcess = {
      id: generateId(),
      date: dayDate,
      activities: [],
      isCompleted: false,
      finalizado: false, // Novo campo
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveDay(newDay);
    return newDay;
  };

  // Adicionar atividade
  const addActivity = async (activityData: Omit<Activity, "id">) => {
    if (!currentDay) return;
    const newActivity: Activity = { ...activityData, id: generateId() };
    const updatedDay: DayProcess = {
      ...currentDay,
      activities: [...currentDay.activities, newActivity],
      updatedAt: new Date().toISOString(),
    };
    await saveDay(updatedDay);
  };

  // Editar atividade
const editActivity = async (
  activityId: string,
  activityData: Omit<Activity, "id">,
  dayId?: string
) => {
  const targetDay = dayId
    ? dayProcesses.find(d => d.id === dayId)
    : currentDay;

  if (!targetDay) return;

  const updatedDay: DayProcess = {
    ...targetDay,
    activities: targetDay.activities.map(a =>
      a.id === activityId ? { ...activityData, id: activityId } : a
    ),
    updatedAt: new Date().toISOString(),
  };
  await saveDay(updatedDay);
};

// Remover atividade (aceita dayId opcional)
const removeActivity = async (activityId: string, dayId?: string) => {
  const targetDay = dayId
    ? dayProcesses.find(d => d.id === dayId)
    : currentDay;

  if (!targetDay) return;

  const updatedActivities = targetDay.activities.filter(a => a.id !== activityId);

  if (updatedActivities.length === 0) {
    // Remove o documento do dia do Firestore
    await deleteDoc(doc(daysCol, targetDay.date));
    setDayProcesses(prev => prev.filter(d => d.id !== targetDay.id));
    if (currentDay?.id === targetDay.id) setCurrentDay(null);
    return;
  }

  const updatedDay: DayProcess = {
    ...targetDay,
    activities: updatedActivities,
    updatedAt: new Date().toISOString(),
  };
  await saveDay(updatedDay);
};
  // Criar tag
  const createTag = async (name: string): Promise<Tag> => {
    const colors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#6366F1", "#8B5A2B"];
    const newTag: Tag = { id: generateId(), name, color: colors[Math.floor(Math.random() * colors.length)] };
    const updatedTags = [...availableTags, newTag];
    await saveTags(updatedTags);
    return newTag;
  };

  // Próximo horário de início
  const getNextStartTime = () => {
    if (!currentDay || currentDay.activities.length === 0) return "00:00";
    const sorted = [...currentDay.activities].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return sorted[sorted.length - 1].endTime;
  };

  // Finalizar dia
  const completeDay = async () => {
    if (!currentDay || currentDay.activities.length === 0) return;

    const activities = currentDay.activities;
    const uniqueTags = new Set(activities.flatMap(a => a.tags.map(t => t.id))).size;
    const totalDuration = activities.reduce((total, a) => {
      const start = new Date(`2023-01-01 ${a.startTime}`);
      const end = new Date(`2023-01-01 ${a.endTime}`);
      return total + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);

    const commitmentLevel = Math.min(
      10,
      Math.max(1, activities.length * 1.5 + uniqueTags * 0.8 + (totalDuration / 60) * 0.5)
    );

    const updatedDay: DayProcess = {
      ...currentDay,
      commitmentLevel: Math.round(commitmentLevel * 10) / 10,
      isCompleted: true,
      finalizado: true, // Marca como finalizado
      updatedAt: new Date().toISOString(),
    };

    await saveDay(updatedDay);
  };

  // Dados para gráfico
  const getCommitmentData = (): CommitmentData[] =>
    dayProcesses
      .filter(d => d.commitmentLevel !== undefined)
      .map(d => ({
        date: d.date,
        level: d.commitmentLevel!,
        activitiesCount: d.activities.length,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

  return {
    currentDay,
    dayProcesses,
    availableTags,
    hasActiveDay: currentDay !== null && !currentDay.finalizado,
    createNewDay,
    addActivity,
    editActivity,
    removeActivity,
    createTag,
    getNextStartTime,
    completeDay,
    commitmentData: getCommitmentData(),
  };
}
