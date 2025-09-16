import { motion } from "framer-motion";
import { Sparkles, Save, Plus, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommitmentChart } from "@/components/Charts/CommitmentChart";
import { Navigation } from "@/components/Navigation";
import { useDayFlow } from "@/hooks/useDayFlow";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-dayflow.jpg";
import { useNavigate } from "react-router-dom";
import { InsightsButton } from "@/components/InsightsButton";
import { CompletedDayCard } from "@/components/DayProcess/CompletedDayCard";


const Index = () => {
const {
  dayProcesses,
  availableTags,
  commitmentData,
  createNewDay,
  hasActiveDay
} = useDayFlow();

const navigate = useNavigate();

  // Filtrar apenas dias finalizados
  const completedDays = dayProcesses.filter(day => day.isCompleted);
  const activeDay = dayProcesses.find(day => !day.isCompleted);
  const pendingActivities = activeDay?.activities || [];
  // Pega os últimos 5 dias finalizados ou ativos
  const lastDays = dayProcesses
    .sort((a, b) => b.date.localeCompare(a.date)) // do mais recente pro mais antigo
    .slice(0, 5); // pega no máximo 5 dias

  // Junta todas as atividades desses dias
  const atividadesParaInsights = lastDays.flatMap(day => day.activities);
  console.log("atividadesParaInsights:", atividadesParaInsights);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
console.log("dayProcesses:", dayProcesses);



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
              Histórico e Análise de Rotina
            </p>
            <p className="text-white/80 text-lg mb-8">
              Visualize seus dados e padrões de compromisso
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-4"
            >
               <Navigation onCreateDay={createNewDay} hasActiveDay={hasActiveDay} />
              
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        
        <div className="max-w-6xl mx-auto">
          {pendingActivities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 cursor-pointer"
              onClick={() => navigate("/day-process")}
            >
              <Card className="border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-blue-700">Atividades Pendentes</h3>
                      <p className="text-sm text-blue-600">
                        Última atualização: {activeDay?.updatedAt ? new Date(activeDay.updatedAt).toLocaleTimeString('pt-BR') : '-'}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      Pendente
                    </Badge>
                  </div>

                  <div className="grid gap-3">
                    {pendingActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-mono text-blue-700">
                            {activity.startTime} - {activity.endTime}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
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
                </CardContent>
              </Card>
            </motion.div>
          )}


          {/* Gráfico de Compromisso */}
          <div className="mb-8">
            <CommitmentChart data={commitmentData} />
          </div>

          {/* Botão de Insights da IA */}

        <InsightsButton atividades={atividadesParaInsights} />


          

          {/* Histórico de Dias Finalizados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Histórico de Atividades
              </h2>
              <Badge variant="secondary" className="text-sm">
                {completedDays.length} dias finalizados
              </Badge>
            </div>

            {completedDays.length === 0 ? (
              <Card className="border-2 border-dashed border-muted-foreground/30">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2 text-muted-foreground">
                    Nenhum dia finalizado ainda
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Complete seu primeiro processo do dia para ver o histórico aqui.
                  </p>
                  <Link to="/day-process">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Iniciar Primeiro Dia
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
               <div className="grid gap-4">
  {completedDays
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((day) => (
      <CompletedDayCard key={day.id} day={day} formatDate={formatDate} />
    ))}
</div>

            )}
          </motion.div>

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