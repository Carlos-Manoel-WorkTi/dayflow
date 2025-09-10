import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityForm } from "@/components/DayProcess/ActivityForm";
import { ActivityList } from "@/components/DayProcess/ActivityList";
import { useDayFlow } from "@/hooks/useDayFlow";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/loader/Loading";
import DateModal from "@/components/DayProcess/DateModal";

const DayProcess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // Loading de criação de novo dia
  const [loadingNewDay, setLoadingNewDay] = useState(false);
  // Loading de carregamento do dia ativo
  const [loadingDay, setLoadingDay] = useState(true);
  const [showDateModal, setShowDateModal] = useState(false);

  // Quando currentDay/hasActiveDay mudar, consideramos que o dia foi carregado
  useEffect(() => {
    if (hasActiveDay || currentDay) {
      setLoadingDay(false);
    }
  }, [hasActiveDay, currentDay]);

  const getTodayDate = () =>
    new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleCompleteDay = () => {
    if (!currentDay || currentDay.activities.length === 0) {
      toast({
        title: "Nenhuma atividade registrada",
        description: "Adicione pelo menos uma atividade.",
        variant: "destructive",
      });
      return;
    }

    completeDay();

    toast({
      title: "Dia finalizado com sucesso!",
      description: "Seu nível de compromisso foi calculado e salvo.",
    });

    navigate("/");
  };

  const handleCreateNewDay = async (manualDate?: string) => {
    setLoadingNewDay(true);
    try {
      const day = await createNewDay(manualDate);
      toast({
        title: "Novo dia criado!",
        description: `Dia ${day.date} iniciado.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao criar novo dia",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoadingNewDay(false);
    }
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold">Processo do Dia</h1>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{getTodayDate()}</p>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loadingDay ? (
            // Loader centralizado enquanto o dia está sendo carregado
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
              <Loader />
              <p className="text-muted-foreground">Carregando atividades...</p>
            </div>
          ) : hasActiveDay && currentDay ? (
            // Card do dia ativo + Form + Lista de atividades
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="border-2 border-primary/20 gradient-card">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-primary mb-1">Processo do Dia Ativo</h2>
                      <p className="text-muted-foreground">{currentDay.activities.length} atividades registradas</p>
                    </div>
                    {!currentDay.isCompleted ? (
                      <Button onClick={handleCompleteDay} variant="success" className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Finalizar Dia
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Dia Finalizado</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {!currentDay.isCompleted && (
                  <ActivityForm
                    onAddActivity={addActivity}
                    availableTags={availableTags}
                    onCreateTag={createTag}
                    nextStartTime={
                      currentDay.activities.length > 0
                        ? currentDay.activities[currentDay.activities.length - 1].endTime
                        : "00:00"
                    }
                  />
                )}
              </motion.div>

              <div>
                <ActivityList
                  activities={currentDay.activities}
                  onDeleteActivity={removeActivity}
                  onEditActivity={editActivity}
                />
              </div>
            </div>
          ) : (
            // Nenhum dia ativo -> botões para criar dia
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              {loadingNewDay ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader />
                  <p className="text-muted-foreground">Criando novo dia...</p>
                </div>
              ) : (
                <>
                  <Button onClick={() => handleCreateNewDay()} className="w-64">
                    Criar Dia de Hoje
                  </Button>
                  <Button onClick={() => setShowDateModal(true)} variant="outline" className="w-64">
                    Criar Dia Manualmente
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <DateModal
        isOpen={showDateModal}
        onClose={() => setShowDateModal(false)}
        onConfirm={(date) => {
          handleCreateNewDay(date);
          setShowDateModal(false);
        }}
      />
    </div>
  );
};

export default DayProcess;
