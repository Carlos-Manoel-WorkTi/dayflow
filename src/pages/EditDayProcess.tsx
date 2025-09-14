import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityForm } from "@/components/DayProcess/ActivityForm";
import { ActivityList } from "@/components/DayProcess/ActivityList";
import { useDayFlow } from "@/hooks/useDayFlow";
import Loader from "@/components/loader/Loading";
import { getTodayDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DayProcess } from "@/types"; // ✅ Import correto

const EditDayProcess = () => {
  const { id } = useParams<{ id: string }>(); // id será a **date**
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    dayProcesses,
    availableTags,
    createTag,
    saveDay,
  } = useDayFlow();

  const [loading, setLoading] = useState(true);
  const [editDay, setEditDay] = useState<DayProcess | null>(null);

  useEffect(() => {
    // ✅ Procurar pelo date, que é a chave do Firestore
    const foundDay = dayProcesses.find((d) => d.id === id); // ✅ volta para id

    if (foundDay) setEditDay(foundDay);
    setLoading(false);
  }, [id, dayProcesses]);

  const handleSaveEdit = async () => {
    if (!editDay) return;
    await saveDay(editDay);
    toast({
      title: "Dia editado com sucesso!",
      description: "As alterações foram salvas.",
    });
    navigate("/completed-days");
  };

  if (loading || !editDay) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <Loader />
        <p className="text-muted-foreground">Carregando informações do dia...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/completed-days">
              <Button variant="ghost" size="icon" className="sm:size-sm">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline ml-2">Voltar</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold">Editar Dia Finalizado</h1>
            </div>
          </div>
          <p className="hidden sm:block text-sm text-muted-foreground">
            {getTodayDate()}
          </p>
        </div>
      </motion.header>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 gradient-card">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary mb-1">
                  Dia: {editDay.date}
                </h2>
                <p className="text-muted-foreground">
                  {editDay.activities.length} atividades registradas
                </p>
              </div>
              <Button
                onClick={handleSaveEdit}
                variant="default"
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* Formulário de atividade */}
          <ActivityForm
            onAddActivity={(activity) => {
              setEditDay((prev) =>
                prev
                  ? {
                      ...prev,
                      activities: [
                        ...prev.activities,
                        { ...activity, id: crypto.randomUUID() }, // ✅ ID único
                      ],
                    }
                  : prev
              );
            }}
            availableTags={availableTags}
            onCreateTag={createTag}
            nextStartTime={
              editDay.activities.length > 0
                ? editDay.activities[editDay.activities.length - 1].endTime
                : "00:00"
            }
          />

          {/* Lista de atividades */}
          <ActivityList
            activities={editDay.activities}
            onDeleteActivity={(activityId) =>
              setEditDay((prev) =>
                prev
                  ? {
                      ...prev,
                      activities: prev.activities.filter((a) => a.id !== activityId),
                    }
                  : prev
              )
            }
            onEditActivity={(activityId, activityData) =>
              setEditDay((prev) =>
                prev
                  ? {
                      ...prev,
                      activities: prev.activities.map((a) =>
                        a.id === activityId
                          ? { ...activityData, id: activityId }
                          : a
                      ),
                    }
                  : prev
              )
            }
            
          />
        </div>
      </div>
    </div>
  );
};

export default EditDayProcess;
