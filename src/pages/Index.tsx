import { motion } from "framer-motion";
import { Sparkles, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateDayButton } from "@/components/DayProcess/CreateDayButton";
import { ActivityForm } from "@/components/DayProcess/ActivityForm";
import { ActivityList } from "@/components/DayProcess/ActivityList";
import { CommitmentChart } from "@/components/Charts/CommitmentChart";
import { useDayFlow } from "@/hooks/useDayFlow";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-dayflow.jpg";

const Index = () => {
  const {
    currentDay,
    hasActiveDay,
    availableTags,
    commitmentData,
    createNewDay,
    addActivity,
    removeActivity,
    createTag,
    completeDay,
  } = useDayFlow();

  const { toast } = useToast();

  const handleCompleteDay = () => {
    if (!currentDay || currentDay.activities.length === 0) {
      toast({
        title: "Nenhuma atividade registrada",
        description: "Adicione pelo menos uma atividade antes de finalizar o dia.",
        variant: "destructive",
      });
      return;
    }

    completeDay();
    toast({
      title: "Dia finalizado com sucesso!",
      description: "Seu nível de compromisso foi calculado e salvo.",
    });
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative gradient-hero text-white py-16 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="DayFlow Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-10 h-10" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">DayFlow</h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 mb-3 font-medium">
              Organize sua rotina, analise seus padrões
            </p>
            <p className="text-white/80 text-lg mb-8">
              {getTodayDate()}
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-white/90 text-sm">
                  ✨ Sistema inteligente para análise de rotina diária
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Gráfico de Compromisso */}
          <div className="mb-8">
            <CommitmentChart data={commitmentData} />
          </div>

          {/* Seção Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Criar/Gerenciar Dia */}
            <div className="space-y-6">
              {!hasActiveDay ? (
                <CreateDayButton 
                  onCreateDay={createNewDay}
                  hasActiveDay={hasActiveDay}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card className="border-2 border-primary/20 gradient-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-primary mb-1">
                            Processo do Dia Ativo
                          </h2>
                          <p className="text-muted-foreground">
                            {currentDay?.activities.length || 0} atividades registradas
                          </p>
                        </div>
                        
                        {currentDay && !currentDay.isCompleted && (
                          <Button 
                            onClick={handleCompleteDay}
                            variant="success"
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Finalizar Dia
                          </Button>
                        )}
                        
                        {currentDay?.isCompleted && (
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Dia Finalizado</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {!currentDay?.isCompleted && (
                    <ActivityForm
                      onAddActivity={addActivity}
                      availableTags={availableTags}
                      onCreateTag={createTag}
                    />
                  )}
                </motion.div>
              )}
            </div>

            {/* Lista de Atividades */}
            <div>
              {hasActiveDay && currentDay && (
                <ActivityList
                  activities={currentDay.activities}
                  onDeleteActivity={removeActivity}
                />
              )}
            </div>
          </div>

          {/* Status do Sistema */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Card className="border border-primary/20 bg-accent/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span>Sistema Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Auto-save Ativo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{availableTags.length} Tags Disponíveis</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;