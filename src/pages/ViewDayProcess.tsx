import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Edit, Trash2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDayFlow } from "@/hooks/useDayFlow";
import Loader from "@/components/loader/Loading";
import { DayProcess } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Recharts
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

const ViewDayProcess = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { dayProcesses, removeDay } = useDayFlow();

  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState<DayProcess | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  useEffect(() => {
    const foundDay = dayProcesses.find((d) => d.id === id);
    if (foundDay) setDay(foundDay);
    setLoading(false);
  }, [id, dayProcesses]);

  const handleDelete = async () => {
    if (!day) return;
    await removeDay(day.id);
    toast({
      title: "Dia excluído",
      description: "O processo inteiro foi removido.",
    });
    navigate("/completed-days");
  };

  const handleAnalyzeWithAI = async () => {
    if (!day) return;
    setAiLoading(true);
    setAiResult(null);

    setTimeout(() => {
      setAiResult(
        `📊 Análise do dia ${day.date}: Você concluiu ${day.activities.length} atividades. 
        Seu nível de compromisso foi ${day.commitmentLevel || 0}/10. 
        Sugestão: manter consistência e equilibrar tempo de descanso.`
      );
      setAiLoading(false);
    }, 1200);
  };

  if (loading || !day) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <Loader />
        <p className="text-muted-foreground">Carregando informações do dia...</p>
      </div>
    );
  }

  const totalTime = day.activities.reduce((acc, act) => {
    const [sh, sm] = act.startTime.split(":").map(Number);
    const [eh, em] = act.endTime.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    return acc + (end - start);
  }, 0);

  // Data para PieChart (tempo por atividade)
  const pieData = day.activities.map((act, i) => {
    const [sh, sm] = act.startTime.split(":").map(Number);
    const [eh, em] = act.endTime.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    const duration = (end - start) / 60; // em horas
    return { name: act.description, value: duration };
  });

  // Data para RadarChart (resumo)
  const radarData = [
    { subject: "Atividades", A: day.activities.length, fullMark: 10 },
    { subject: "Compromisso", A: day.commitmentLevel || 0, fullMark: 10 },
    { subject: "Tempo (h)", A: Math.floor(totalTime / 60), fullMark: 24 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/completed-days">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold">Visualizar Dia {day.date}</h1>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Resumo */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-primary mb-1">Resumo do Dia</h2>
              <p className="text-muted-foreground">
                {day.activities.length} atividades • Compromisso{" "}
                {day.commitmentLevel || 0}/10 • Tempo total:{" "}
                {Math.floor(totalTime / 60)}h {totalTime % 60}m
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => navigate(`/edit-day/${day.id}`)}
              >
                <Edit className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Botão IA */}
        <div className="flex justify-center mb-6">
          <Button onClick={handleAnalyzeWithAI} disabled={aiLoading}>
            <Bot className="w-4 h-4 mr-2" />
            {aiLoading ? "Analisando..." : "Analisar com IA"}
          </Button>
        </div>

        {/* Resposta IA */}
        {aiResult && (
          <Card className="mb-6">
            <CardContent className="p-6 whitespace-pre-line">{aiResult}</CardContent>
          </Card>
        )}

     {/* Gráficos */}
<div className="flex flex-wrap gap-6 justify-center mb-6 w-full max-w-7xl mx-auto">
  <Card className="flex-1 min-w-[280px]">
    <CardContent className="p-4 h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius="80%"
            paddingAngle={4}
            dataKey="value"
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[280px]">
    <CardContent className="p-4 h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar
            name="Você"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</div>


        {/* Lista de atividades */}
        <Card>
          <CardContent className="p-6 grid gap-3">
            {day.activities
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 bg-muted/30 rounded-lg flex justify-between"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {activity.startTime} - {activity.endTime}
                    </p>
                    <p className="text-sm">{activity.description}</p>
                  </div>
                  <div className="flex gap-1 flex-wrap">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewDayProcess;
