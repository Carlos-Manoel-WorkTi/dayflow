import { useMemo } from "react";
import { DayProcess } from "@/types";

interface UseStatsOptions {
  defaultGoal?: number; // meta mínima
  maxGoal?: number;     // meta máxima
  windowSize?: number;  // quantos dias recentes considerar
}

export function useStats(
  dayProcesses: DayProcess[],
  {
    defaultGoal = 5,
    maxGoal = 12,
    windowSize = 7,
  }: UseStatsOptions = {}
) {
  // Calcula a média adaptativa da meta
  const dailyGoal = useMemo(() => {
    if (!dayProcesses || dayProcesses.length === 0) return defaultGoal;

    // pega os últimos N dias
    const sorted = [...dayProcesses].sort((a, b) =>
      b.date.localeCompare(a.date)
    );
    const recent = sorted.slice(0, windowSize);

    const totalActivities = recent.reduce(
      (acc, d) => acc + (d.activities?.length || 0),
      0
    );
    const media = totalActivities / recent.length;

    // meta híbrida (não deixa cair abaixo do mínimo, nem passar do máximo)
    return Math.min(Math.max(Math.round(media), defaultGoal), maxGoal);
  }, [dayProcesses, defaultGoal, maxGoal, windowSize]);

  // Estatísticas extras (já pensando em gráficos)
  const stats = useMemo(() => {
    const totalAtividades = dayProcesses.reduce(
      (acc, d) => acc + (d.activities?.length || 0),
      0
    );

    const diasFinalizados = dayProcesses.filter((d) => d.finalizado).length;

    return {
      totalAtividades,
      diasFinalizados,
      mediaAtividades: dayProcesses.length
        ? totalAtividades / dayProcesses.length
        : 0,
    };
  }, [dayProcesses]);

  return {
    dailyGoal,
    stats,
  };
}
