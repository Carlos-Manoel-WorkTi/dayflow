import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function InsightsButton({ atividades }: { atividades: any[] }) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const gerarInsights = async () => {
    if (!atividades || atividades.length === 0) {
      setInsight("Nenhuma atividade registrada neste dia.");
      setOpenModal(true);
      return;
    }

    setLoading(true);
    const resumo = atividades
      .map(a => `- ${a.titulo || a.nome || "Atividade"} (${a.horario || "sem horário"})`)
      .join("\n");

    try {
      const resposta = await getInsights({
        system: "Analista de produtividade",
        prompt: `Aqui estão as atividades do dia:\n${resumo}\n\nFaça um resumo do dia e gere insights práticos para melhorar a rotina.`
      });
      setInsight(resposta);
      setOpenModal(true);
    } catch (err) {
      console.error(err);
      setInsight("Erro ao gerar insights.");
      setOpenModal(true);
    }
    setLoading(false);
  };

  return (
    <div className="mb-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button onClick={gerarInsights} disabled={loading} variant="gradient" size="lg">
          <Sparkles className="w-5 h-5 mr-2" />
          {loading ? "Gerando..." : "Gerar Insights"}
        </Button>
      </motion.div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-lg rounded-2xl shadow-xl bg-white">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle className="text-lg font-bold text-primary">
              ✨ Insights do Dia
            </DialogTitle>
            <button onClick={() => setOpenModal(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </DialogHeader>

          <div className="mt-4 text-left">
            {insight ? (
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{insight}</p>
            ) : (
              <p className="text-gray-400">Gerando insights...</p>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
