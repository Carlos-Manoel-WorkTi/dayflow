import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface CreateDayButtonProps {
  onCreateDay: () => void;
  hasActiveDay: boolean;
}

export function CreateDayButton({ onCreateDay, hasActiveDay }: CreateDayButtonProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();

  const handleCreateDay = () => {
    if (hasActiveDay) {
      toast({
        title: "Dia já iniciado",
        description: "Você já tem um processo ativo para hoje. Continue adicionando atividades!",
      });
      return;
    }
    onCreateDay();
    toast({
      title: "História do Dia Iniciada!",
      description: "Comece a registrar suas atividades de hoje.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className="gradient-card border-0 shadow-lg hover:shadow-glow transition-all duration-300 cursor-pointer"
        onClick={handleCreateDay}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <CardContent className="p-8 text-center">
          <motion.div
            animate={{ scale: isHovering ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Calendar className="w-12 h-12 text-primary" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: isHovering ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="w-5 h-5 text-primary-glow" />
                </motion.div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-primary mb-2">
              {hasActiveDay ? "Continue Sua História" : "Criar História do Dia"}
            </h2>
            
            <p className="text-muted-foreground mb-6">
              {hasActiveDay 
                ? "Adicione mais atividades ao seu dia atual"
                : "Inicie o registro das suas atividades de hoje"
              }
            </p>

            <Button 
              variant={hasActiveDay ? "default" : "hero"} 
              size="lg" 
              className="min-w-[200px]"
            >
              <Plus className="w-5 h-5 mr-2" />
              {hasActiveDay ? "Continuar" : "Iniciar Hoje"}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}