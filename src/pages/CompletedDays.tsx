import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDayFlow } from "@/hooks/useDayFlow";
import Loader from "@/components/loader/Loading";
import { useNavigate } from "react-router-dom";

const CompletedDays = () => {
  const navigate = useNavigate();
  const { dayProcesses, removeDay } = useDayFlow();
  const [loading, setLoading] = useState(true);
  const [confirmDayId, setConfirmDayId] = useState<string | null>(null); // Dia a confirmar exclusão

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
                .map((day) => {
                  const tooMany = day.activities.length > 4;

                  return (
                    <Card key={day.id} className="border border-primary/10 relative">
                      <CardContent className="p-6">
                        {/* Cabeçalho */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg">
                              {formatDate(day.date)}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                              <span>{day.activities.length} atividades</span>
                              <span>•</span>
                              <span>
                                Compromisso: {day.commitmentLevel || 0}/10
                              </span>
                              <Badge
                                variant="secondary"
                                className="bg-success/10 text-success border-success/20"
                              >
                                Finalizado
                              </Badge>
                            </div>
                          </div>

                          {/* Botões */}
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => navigate(`/edit-day/${day.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => setConfirmDayId(day.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Lista de atividades */}
                        <div className="max-h-60 overflow-hidden relative">
                          <div className="grid gap-3">
                            {day.activities
                              .sort((a, b) =>
                                a.startTime.localeCompare(b.startTime)
                              )
                              .slice(0, 4)
                              .map((activity) => (
                                <div
                                  key={activity.id}
                                  className="p-3 bg-muted/30 rounded-lg"
                                >
                                  <p className="font-medium text-sm">
                                    {activity.startTime} - {activity.endTime}
                                  </p>
                                  <p className="text-sm">
                                    {activity.description}
                                  </p>
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    {activity.tags.map((tag) => (
                                      <Badge
                                        key={tag.id}
                                        variant="outline"
                                        className="text-xs"
                                        style={{
                                          borderColor: tag.color + "40",
                                          color: tag.color,
                                        }}
                                      >
                                        {tag.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>

                          {/* Botão ver todas */}
                          {tooMany && (
                            <div className="mt-4 flex justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/edit-day/${day.id}`)}
                              >
                                Ver todas atividades
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>

                      {/* Modal de confirmação */}
                      {confirmDayId === day.id && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
                          <Card className="w-80 p-6">
                            <p className="text-center mb-4">
                              Tem certeza que deseja excluir este dia e todas
                              as atividades?
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
                    </Card>
                  );
                })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompletedDays;
