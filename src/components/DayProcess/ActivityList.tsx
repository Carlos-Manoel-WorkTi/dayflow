import { motion } from "framer-motion";
import { Clock, Tag as TagIcon, Trash2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ActivityListProps {
  activities: Activity[];
  onDeleteActivity: (activityId: string) => void;
}

export function ActivityList({ activities, onDeleteActivity }: ActivityListProps) {
  const { toast } = useToast();

  const handleDelete = (activityId: string, description: string) => {
    onDeleteActivity(activityId);
    toast({
      title: "Atividade removida",
      description: `"${description}" foi removida com sucesso.`,
    });
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2023-01-01 ${startTime}`);
    const end = new Date(`2023-01-01 ${endTime}`);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  };

  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-muted-foreground"
      >
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">Nenhuma atividade registrada</h3>
        <p>Comece adicionando sua primeira atividade do dia!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Atividades de Hoje ({activities.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group"
            >
              <Card className={`border transition-all duration-200 hover:shadow-md ${
                activity.isPrivate ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                          <Clock className="w-4 h-4" />
                          {activity.startTime} - {activity.endTime}
                          <span className="text-muted-foreground">
                            ({calculateDuration(activity.startTime, activity.endTime)})
                          </span>
                        </div>
                        {activity.isPrivate && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Lock className="w-3 h-3" />
                            <span className="text-xs">Privado</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-foreground leading-relaxed">
                        {activity.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {activity.tags.map((tag) => (
                          <Badge 
                            key={tag.id} 
                            style={{ backgroundColor: tag.color }}
                            className="text-white text-xs"
                          >
                            <TagIcon className="w-3 h-3 mr-1" />
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(activity.id, activity.description)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}