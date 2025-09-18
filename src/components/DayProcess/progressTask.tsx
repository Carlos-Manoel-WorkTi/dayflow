import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ProgressStatsProps } from "@/types";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProgressStats = ({ activities, completed, goal }: ProgressStatsProps) => {
  const percent = Math.min((activities.length / goal) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 border rounded-2xl bg-card shadow-sm space-y-3"
    >
      {/* Cabeçalho com "Metas" e tooltip */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium text-muted-foreground">Metas do Dia</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle
                  className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition"
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-sm">
                <p>
                  A meta diária é calculada com base na sua média de atividades
                  recentes, ajustada para nunca ser menor que <b>5</b> nem maior
                  que <b>12</b>.
                </p>
                <p className="mt-1 text-muted-foreground">
                  Assim, suas metas se adaptam ao seu ritmo de produtividade. 🚀
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <span className="text-sm font-semibold text-primary">
          {Math.round(percent)}%
        </span>
      </div>

      <Progress value={percent} />

      <p className="text-sm text-muted-foreground">
        {activities.length}/{goal} atividades concluídas
      </p>

      {/* Feedback gamificado */}
      {completed && activities.length >= goal && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-3 rounded-xl bg-green-100 text-green-800 font-semibold text-center"
        >
          🎉 Parabéns! Você bateu sua meta do dia!
        </motion.div>
      )}
      {!completed && percent >= 50 && percent < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl bg-yellow-100 text-yellow-800 font-medium text-center"
        >
          ✨ Boa! Você já passou da metade!
        </motion.div>
      )}
      {!completed && percent === 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl bg-blue-100 text-blue-800 font-medium text-center"
        >
          ✅ Você completou todas as atividades da meta!
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressStats;
