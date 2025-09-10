import { motion } from "framer-motion";
import { TrendingUp, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { CommitmentData } from "@/types";

interface CommitmentChartProps {
  data: CommitmentData[];
}

const chartConfig = {
  level: {
    label: "Nível de Compromisso",
    color: "hsl(var(--primary))",
  },
  activitiesCount: {
    label: "Número de Atividades",
    color: "hsl(var(--info))",
  },
};

export function CommitmentChart({ data = [] }: { data?: CommitmentData[] }) {
  const averageCommitment = data.length > 0 
    ? data.reduce((sum, item) => sum + item.level, 0) / data.length 
    : 0;

  const totalActivities = data.reduce((sum, item) => sum + item.activitiesCount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Gráfico de Compromisso
          </CardTitle>
          <CardDescription>
            Acompanhe sua evolução diária e padrões de produtividade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 rounded-lg gradient-secondary"
            >
              <Award className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {averageCommitment.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Compromisso Médio</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 rounded-lg gradient-secondary"
            >
              <Calendar className="w-6 h-6 text-info mx-auto mb-2" />
              <div className="text-2xl font-bold text-info">
                {data.length}
              </div>
              <div className="text-sm text-muted-foreground">Dias Registrados</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 rounded-lg gradient-secondary"
            >
              <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-success">
                {totalActivities}
              </div>
              <div className="text-sm text-muted-foreground">Total de Atividades</div>
            </motion.div>
          </div>

          {data.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="commitmentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => 
                      new Date(value).toLocaleDateString('pt-BR', { 
                        weekday: 'long',
                        day: '2-digit', 
                        month: 'long' 
                      })
                    }
                  />
                  <Area 
                    type="monotone" 
                    dataKey="level" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#commitmentGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Ainda não há dados suficientes</h3>
              <p>Registre mais dias para ver seu gráfico de compromisso!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}