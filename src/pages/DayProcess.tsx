import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateDayButton } from "@/components/DayProcess/CreateDayButton";
import { ActivityForm } from "@/components/DayProcess/ActivityForm";
import { ActivityList } from "@/components/DayProcess/ActivityList";
import { useDayFlow } from "@/hooks/useDayFlow";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const DayProcess = () => {
  const {
    currentDay,
    hasActiveDay,
    availableTags,
    createNewDay,
    addActivity,
    editActivity,
    removeActivity,
    createTag,
    completeDay,
    getNextStartTime,
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
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold">Processo do Dia</h1>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {getTodayDate()}
            </p>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Seção Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Criar/Gerenciar Dia */}
            <div className="space-y-6">
              {!hasActiveDay ? (
                <div className="fixed bottom-6 right-6 z-50">
                  <CreateDayButton 
                    onCreateDay={createNewDay}
                    hasActiveDay={hasActiveDay}
                  />
                </div>
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
                      nextStartTime={getNextStartTime()}
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
                  onEditActivity={editActivity}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botão fixo quando não há atividades */}
      {!hasActiveDay && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent pointer-events-none">
          <div className="flex justify-center pointer-events-auto">
            <CreateDayButton 
              onCreateDay={createNewDay}
              hasActiveDay={hasActiveDay}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DayProcess;