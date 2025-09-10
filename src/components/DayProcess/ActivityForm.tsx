  import { useState, useEffect } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { Clock, Plus, X, Tag as TagIcon } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import { Badge } from "@/components/ui/badge";
  import { Activity, Tag } from "@/types";
  import { useToast } from "@/hooks/use-toast";

  interface ActivityFormProps {
    onAddActivity: (activity: Omit<Activity, "id">) => void;
    availableTags: Tag[];
    onCreateTag: (tagName: string) => void;
    nextStartTime: string; // recebe horário final da última atividade
  }

  export function ActivityForm({ onAddActivity, availableTags, onCreateTag, nextStartTime }: ActivityFormProps) {
    const [startTime, setStartTime] = useState(nextStartTime);
    const [endTime, setEndTime] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [newTagName, setNewTagName] = useState("");
    const [showTagInput, setShowTagInput] = useState(false);
    const { toast } = useToast();

    // Atualiza o startTime sempre que nextStartTime mudar
    useEffect(() => {
      setStartTime(nextStartTime);
    }, [nextStartTime]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!startTime || !endTime || !description.trim()) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha horário de início, fim e descrição.",
          variant: "destructive",
        });
        return;
      }

      if (selectedTags.length === 0) {
        toast({
          title: "Tags obrigatórias",
          description: "Adicione pelo menos uma tag.",
          variant: "destructive",
        });
        return;
      }

      onAddActivity({
        startTime,
        endTime,
        description: description.trim(),
        tags: selectedTags,
      });

      // Reset form para próxima atividade
      setStartTime(nextStartTime);
      setEndTime("");
      setDescription("");
      setSelectedTags([]);
    };

    const handleAddTag = (tag: Tag) => {
      if (!selectedTags.find(t => t.id === tag.id)) setSelectedTags([...selectedTags, tag]);
    };

    const handleRemoveTag = (tagId: string) => {
      setSelectedTags(selectedTags.filter(t => t.id !== tagId));
    };

    const handleCreateNewTag = () => {
      if (newTagName.trim()) {
        onCreateTag(newTagName.trim());
        setNewTagName("");
        setShowTagInput(false);
      }
    };

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Nova Atividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Horário de Início</Label>
                  <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Horário de Fim</Label>
                  <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição da atividade..."
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Tags</Label>
                  <Button type="button" size="sm" variant="outline" onClick={() => setShowTagInput(!showTagInput)}>
                    <Plus className="w-4 h-4 mr-1" /> Nova Tag
                  </Button>
                </div>

                <AnimatePresence>
                  {showTagInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2"
                    >
                      <Input
                        placeholder="Nome da nova tag"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleCreateNewTag()}
                      />
                      <Button type="button" size="sm" onClick={handleCreateNewTag}>
                        Criar
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.find((t) => t.id === tag.id) ? "default" : "secondary"}
                      className="cursor-pointer"
                      style={{
                        backgroundColor: selectedTags.find((t) => t.id === tag.id) ? tag.color : undefined,
                      }}
                      onClick={() =>
                        selectedTags.find((t) => t.id === tag.id) ? handleRemoveTag(tag.id) : handleAddTag(tag)
                      }
                    >
                      <TagIcon className="w-3 h-3 mr-1" /> {tag.name}
                    </Badge>
                  ))}
                </div>

                {selectedTags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2 p-3 bg-accent rounded-md"
                  >
                    <span className="text-sm text-muted-foreground">Selecionadas:</span>
                    {selectedTags.map((tag) => (
                      <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="text-white flex items-center gap-1">
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag.id)}
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </motion.div>
                )}
              </div>

              <Button type="submit" className="w-full" variant="gradient">
                <Plus className="w-4 h-4 mr-2" /> Adicionar Atividade
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
