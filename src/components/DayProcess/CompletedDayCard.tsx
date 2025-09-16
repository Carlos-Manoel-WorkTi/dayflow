import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Activity {
  id: string;
  description: string;
  startTime: string;
  endTime: string;
  tags: Tag[];
}

interface Day {
  id: string;
  date: string;
  activities: Activity[];
  commitmentLevel?: number;
}

interface CompletedDayCardProps {
  day: Day;
  formatDate: (date: string) => string;
}

export function CompletedDayCard({ day, formatDate }: CompletedDayCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      key={day.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group cursor-pointer"
      onClick={() => navigate(`/view-day/${day.id}`)}
    >
      <Card className="relative hover:shadow-md transition-all duration-200 border border-primary/10 overflow-hidden">
        {/* Faixa lateral verde */}
        <div className="absolute left-0 top-0 w-1.5 h-full bg-green-500" />

        <CardContent className="p-6 pb-12">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">{formatDate(day.date)}</h3>
              <p className="text-sm text-muted-foreground">
                {day.activities.length} atividades • Nível de compromisso:{" "}
                {day.commitmentLevel || 0}/10
              </p>
            </div>
          </div>

          {/* Lista de até 2 atividades */}
          <div className="grid gap-3">
            {day.activities
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .slice(0, 2)
              .map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-mono text-muted-foreground">
                      {activity.startTime} - {activity.endTime}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.description}
                      </p>
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

        {/* Carimbo menor no canto inferior */}
        <div className="absolute bottom-2 right-3 px-3 py-0.5 rounded-md border border-green-600 text-green-600 font-semibold text-[10px] uppercase tracking-wider opacity-70 rotate-[-6deg]">
          Finalizado
        </div>
      </Card>
    </motion.div>
  );
}
