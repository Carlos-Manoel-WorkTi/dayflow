import { useState } from "react";
import { CommitmentChart } from "@/components/Charts/CommitmentChart";
import { InsightsButton } from "@/components/InsightsButton";
import { CompletedDayCard } from "@/components/DayProcess/CompletedDayCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface WidgetProps {
  completedDays: any[];
  commitmentData: any;
  atividadesParaInsights: any[];
  formatDate: (date: string) => string;
}

export function useWidgets({ completedDays, commitmentData, atividadesParaInsights, formatDate }: WidgetProps) {
  const [widgetOrder, setWidgetOrder] = useState<string[]>([
    "insightsButton",
    "commitmentChart",
    "completedDays"
  ]);
// grid gap-4 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2
  const widgetsMap: Record<string, JSX.Element> = {
    insightsButton: (
      <div className="mb-5 mt-5">
        <InsightsButton atividades={atividadesParaInsights} />
      </div>
    ),
    commitmentChart: (
      <div className="mb-5 mt-5 ">
        <CommitmentChart data={commitmentData} />
      </div>
    ),
    completedDays: (
      <div className="mb-6">
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
                <Button>Iniciar Primeiro Dia</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 ">
            {completedDays
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((day) => (
                <CompletedDayCard key={day.id} day={day} formatDate={formatDate} />
              ))}
          </div>
        )}
      </div>
    ),
  };

  // Cria JSX dinamicamente baseado na ordem
  const widgets = widgetOrder.map(id => ({ id, component: widgetsMap[id] }));

  return { widgets, setWidgets: setWidgetOrder };
}
