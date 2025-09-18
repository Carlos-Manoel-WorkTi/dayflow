import { motion } from "framer-motion";
import { Edit, Trash2, Clock, Tag as TagIcon, Lock, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ActivityListProps {
  activities: Activity[];
  onDeleteActivity: (activityId: string) => void;
  onEditActivity: (activityId: string, activity: Omit<Activity, 'id'>) => void;
}

export function ActivityList({ activities, onDeleteActivity, onEditActivity }: ActivityListProps) {
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
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}min`;
  };

  if (activities.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">Nenhuma atividade registrada</h3>
        <p>Comece adicionando sua primeira atividade do dia!</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Atividades de Hoje ({activities.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities
            .sort((a, b) => b.startTime.localeCompare(b.startTime))
            .map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onDelete={() => handleDelete(activity.id, activity.description)}
                onSave={(data) => onEditActivity(activity.id, data)}
              />
            ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ActivityItemProps {
  activity: Activity;
  onDelete: () => void;
  onSave: (data: Omit<Activity, 'id'>) => void;
}

function ActivityItem({ activity, onDelete, onSave }: ActivityItemProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: activity.description,
    startTime: activity.startTime,
    endTime: activity.endTime,
    tags: activity.tags || [],
  });
  const [newTag, setNewTag] = useState("");

  const handleSave = () => {
    onSave(formData);
    setEditing(false);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, { id: crypto.randomUUID(), name: newTag, color: "#3b82f6" }],
    }));
    setNewTag("");
  };

  const handleRemoveTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t.id !== tagId),
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
      <Card className={`border transition-all duration-200 hover:shadow-md ${activity.isPrivate ? "border-orange-200 bg-orange-50/50" : "border-gray-200"}`}>
        <CardContent className="p-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
          {/* Conteúdo principal */}
          <div className="flex-1 space-y-2">
            {editing ? (
              <>
                {/* Campos de hora */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="time"
                    className="border rounded p-1 w-full sm:w-24"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                  <input
                    type="time"
                    className="border rounded p-1 w-full sm:w-24"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>

                {/* Descrição grande */}
                <textarea
                  className="border rounded p-2 w-full resize-none"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da atividade..."
                />

                {/* Tags editáveis */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.tags.map((tag) => (
                    <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="text-white text-xs flex items-center gap-1">
                      {tag.name}
                      <button type="button" onClick={() => handleRemoveTag(tag.id)} className="ml-1 text-white hover:text-gray-200">×</button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Nova tag"
                    className="border rounded p-1 flex-1"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <Button size="sm" onClick={handleAddTag}>Adicionar</Button>
                </div>
              </>
            ) : (
              <>
                {/* VISUALIZAÇÃO NORMAL */}
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Clock className="w-4 h-4" /> {activity.startTime} - {activity.endTime}
                  <span className="text-muted-foreground ml-1">({calculateDuration(activity.startTime, activity.endTime)})</span>
                  {activity.isPrivate && (
                    <span className="flex items-center gap-1 text-orange-600 ml-2">
                      <Lock className="w-3 h-3" /> Privado
                    </span>
                  )}
                </div>
                <p className="text-foreground leading-relaxed whitespace-pre-line">{activity.description}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {activity.tags.map((tag) => (
                    <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="text-white text-xs flex items-center gap-1">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Botões */}
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            {editing ? (
              <>
                <Button size="icon" variant="success" onClick={handleSave}><Check className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => setEditing(false)} className="bg-red-400 hover:bg-red-400 text-gray-200"><X className="w-4 h-4" /></Button>
              </>
            ) : (
              <>
                <Button size="icon" variant="ghost" onClick={() => setEditing(true)}><Edit className="w-4 h-4 text-primary" /></Button>
                <Button size="icon" variant="destructive" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function calculateDuration(startTime: string, endTime: string) {
  const start = new Date(`2023-01-01 ${startTime}`);
  const end = new Date(`2023-01-01 ${endTime}`);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}min`;
}
