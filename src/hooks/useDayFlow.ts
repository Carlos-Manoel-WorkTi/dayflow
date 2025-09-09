import { useState, useEffect } from "react";
import { Activity, Tag, DayProcess, CommitmentData } from "@/types";

// Mock data e funções utilitárias
const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultTags: Tag[] = [
  { id: "1", name: "Trabalho", color: "#8B5CF6" },
  { id: "2", name: "Estudo", color: "#06B6D4" },
  { id: "3", name: "Exercício", color: "#10B981" },
  { id: "4", name: "Lazer", color: "#F59E0B" },
  { id: "5", name: "Família", color: "#EF4444" },
  { id: "6", name: "Saúde", color: "#EC4899" },
];

export function useDayFlow() {
  const [dayProcesses, setDayProcesses] = useState<DayProcess[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>(defaultTags);
  const [currentDay, setCurrentDay] = useState<DayProcess | null>(null);

  // Carrega dados do localStorage
  useEffect(() => {
    const savedProcesses = localStorage.getItem("dayflow-processes");
    const savedTags = localStorage.getItem("dayflow-tags");
    
    if (savedProcesses) {
      setDayProcesses(JSON.parse(savedProcesses));
    }
    
    if (savedTags) {
      setAvailableTags(JSON.parse(savedTags));
    }

    // Verifica se existe um processo para hoje
    const today = new Date().toISOString().split('T')[0];
    const processes = savedProcesses ? JSON.parse(savedProcesses) : [];
    const todayProcess = processes.find((p: DayProcess) => p.date === today);
    
    if (todayProcess) {
      setCurrentDay(todayProcess);
    }
  }, []);

  // Salva dados no localStorage
  useEffect(() => {
    localStorage.setItem("dayflow-processes", JSON.stringify(dayProcesses));
  }, [dayProcesses]);

  useEffect(() => {
    localStorage.setItem("dayflow-tags", JSON.stringify(availableTags));
  }, [availableTags]);

  // Criar novo dia
  const createNewDay = () => {
    const today = new Date().toISOString().split('T')[0];
    const existingDay = dayProcesses.find(p => p.date === today);
    
    if (existingDay) {
      setCurrentDay(existingDay);
      return existingDay;
    }

    const newDay: DayProcess = {
      id: generateId(),
      date: today,
      activities: [],
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDayProcesses(prev => [...prev, newDay]);
    setCurrentDay(newDay);
    return newDay;
  };

  // Adicionar atividade
  const addActivity = (activityData: Omit<Activity, 'id'>) => {
    if (!currentDay) return;

    const newActivity: Activity = {
      ...activityData,
      id: generateId(),
    };

    const updatedDay = {
      ...currentDay,
      activities: [...currentDay.activities, newActivity],
      updatedAt: new Date().toISOString(),
    };

    setCurrentDay(updatedDay);
    setDayProcesses(prev => 
      prev.map(p => p.id === updatedDay.id ? updatedDay : p)
    );
  };

  // Remover atividade
  const removeActivity = (activityId: string) => {
    if (!currentDay) return;

    const updatedDay = {
      ...currentDay,
      activities: currentDay.activities.filter(a => a.id !== activityId),
      updatedAt: new Date().toISOString(),
    };

    setCurrentDay(updatedDay);
    setDayProcesses(prev => 
      prev.map(p => p.id === updatedDay.id ? updatedDay : p)
    );
  };

  // Criar nova tag
  const createTag = (name: string) => {
    const colors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#6366F1", "#8B5A2B"];
    const newTag: Tag = {
      id: generateId(),
      name,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setAvailableTags(prev => [...prev, newTag]);
    return newTag;
  };

  // Finalizar dia (calcular nível de compromisso)
  const completeDay = () => {
    if (!currentDay) return;

    // Algoritmo simples para calcular compromisso baseado em:
    // - Número de atividades
    // - Duração total das atividades
    // - Variedade de tags
    const activities = currentDay.activities;
    const activitiesCount = activities.length;
    const uniqueTags = new Set(activities.flatMap(a => a.tags.map(t => t.id))).size;
    
    // Calcula duração total em minutos
    const totalDuration = activities.reduce((total, activity) => {
      const start = new Date(`2023-01-01 ${activity.startTime}`);
      const end = new Date(`2023-01-01 ${activity.endTime}`);
      return total + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);

    // Fórmula simples: normalize para escala 1-10
    const commitmentLevel = Math.min(10, Math.max(1, 
      (activitiesCount * 1.5) + 
      (uniqueTags * 0.8) + 
      (totalDuration / 60) * 0.5
    ));

    const updatedDay = {
      ...currentDay,
      commitmentLevel: Math.round(commitmentLevel * 10) / 10,
      isCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    setCurrentDay(updatedDay);
    setDayProcesses(prev => 
      prev.map(p => p.id === updatedDay.id ? updatedDay : p)
    );
  };

  // Dados do gráfico de compromisso
  const getCommitmentData = (): CommitmentData[] => {
    return dayProcesses
      .filter(p => p.commitmentLevel !== undefined)
      .map(p => ({
        date: p.date,
        level: p.commitmentLevel!,
        activitiesCount: p.activities.length,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  return {
    currentDay,
    dayProcesses,
    availableTags,
    hasActiveDay: !!currentDay,
    createNewDay,
    addActivity,
    removeActivity,
    createTag,
    completeDay,
    commitmentData: getCommitmentData(),
  };
}