import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDayFlow } from "@/hooks/useDayFlow";
import Loader from "@/components/loader/Loading";
import { useNavigate } from "react-router-dom";

const CompletedDays = () => {
  const navigate = useNavigate();

  const { dayProcesses, editActivity, removeActivity } = useDayFlow();
  const [editingActivity, setEditingActivity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dayProcesses) {
      const timeout = setTimeout(() => setLoading(false), 1500); // tempo pro loader animar
      return () => clearTimeout(timeout);
    }
  }, [dayProcesses]);

  const completedDays = dayProcesses.filter(day => day.finalizado && day.activities.length > 0);


  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-8">
      {/* Título da seção sempre visível */}
     <motion.div
  className="flex items-center justify-between mb-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Título */}
  <h1 className="text-3xl font-bold flex items-center gap-2">
    <Calendar className="w-7 h-7 text-primary" />
    Dias Finalizados
  </h1>

  {/* Botão voltar */}
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


      {/* Loader centralizado enquanto carrega o conteúdo */}
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
                  <Card key={day.id} className="border border-primary/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {formatDate(day.date)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {day.activities.length} atividades • Compromisso:{" "}
                            {day.commitmentLevel || 0}/10
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-success/10 text-success border-success/20"
                        >
                          Finalizado
                        </Badge>
                      </div>

                      <div className="grid gap-3">
                        {day.activities
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map((activity) => (
                            <div
                              key={activity.id}
                              className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg"
                            >
                              {editingActivity?.id === activity.id ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editingActivity.description}
                                    onChange={(e) =>
                                      setEditingActivity({
                                        ...editingActivity,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                  <div className="flex gap-2">
                                    <Input
                                      type="time"
                                      value={editingActivity.startTime}
                                      onChange={(e) =>
                                        setEditingActivity({
                                          ...editingActivity,
                                          startTime: e.target.value,
                                        })
                                      }
                                    />
                                    <Input
                                      type="time"
                                      value={editingActivity.endTime}
                                      onChange={(e) =>
                                        setEditingActivity({
                                          ...editingActivity,
                                          endTime: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={async () => {
                                        await editActivity(
                                          activity.id,
                                          editingActivity,
                                          day.id
                                        );
                                        setEditingActivity(null);
                                      }}
                                    >
                                      <Save className="w-4 h-4 mr-1" /> Salvar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingActivity(null)}
                                    >
                                      <X className="w-4 h-4 mr-1" /> Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">
                                      {activity.startTime} - {activity.endTime}
                                    </p>
                                    <p className="text-sm">{activity.description}</p>
                                    <div className="flex gap-1 mt-1">
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
                                  <div className="flex gap-2">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() =>
                                        setEditingActivity({ ...activity })
                                      }
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() =>
                                        removeActivity(activity.id, day.id)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompletedDays;
