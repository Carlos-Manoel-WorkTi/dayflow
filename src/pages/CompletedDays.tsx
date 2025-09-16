import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDayFlow } from "@/hooks/useDayFlow";
import Loader from "@/components/loader/Loading";
import { useNavigate } from "react-router-dom";
import { CompletedDayCard } from "@/components/DayProcess/CompletedDayCard";

const CompletedDays = () => {
  const navigate = useNavigate();
  const { dayProcesses, removeDay } = useDayFlow();
  const [loading, setLoading] = useState(true);
  const [confirmDayId, setConfirmDayId] = useState<string | null>(null);

  useEffect(() => {
    if (dayProcesses) {
      const timeout = setTimeout(() => setLoading(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [dayProcesses]);

  const completedDays = dayProcesses.filter(
    (day) => day.finalizado && day.activities.length > 0
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleConfirmRemove = async () => {
    if (confirmDayId) {
      await removeDay(confirmDayId);
      setConfirmDayId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-8 pb-24 md:pb-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-7 h-7 text-primary" />
          Dias Finalizados
        </h1>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar</span>
        </Button>
      </motion.div>

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader />
        </div>
      ) : (
        <>
          {completedDays.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  Nenhum dia finalizado ainda.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {completedDays
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((day) => (
                  <div key={day.id} className="relative">
                    <CompletedDayCard day={day} formatDate={formatDate} />

                    {/* Botões (edit/excluir) */}
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation(); // 👉 impede abrir rota ao clicar
                          navigate(`/edit-day/${day.id}`);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation(); // 👉 impede abrir rota ao clicar
                          setConfirmDayId(day.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Modal de confirmação */}
                    {confirmDayId === day.id && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
                        <Card className="w-80 p-6">
                          <p className="text-center mb-4">
                            Tem certeza que deseja excluir este dia e todas as
                            atividades?
                          </p>
                          <div className="flex justify-between gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setConfirmDayId(null)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleConfirmRemove}
                            >
                              Excluir
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompletedDays;
