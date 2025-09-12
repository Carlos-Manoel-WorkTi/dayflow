import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { listarAtividades } from "@/api/atividades";


export function InsightsButton({ dia }: { dia: string }) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const gerarInsights = async () => {
    setLoading(true);
    setInsight(null);

    try {
      // 🔹 1. Buscar atividades do Firestore
      const atividades = await listarAtividades(dia);

      if (atividades.length === 0) {
        setInsight("Nenhuma atividade registrada neste dia.");
        setOpenModal(true);
        setLoading(false);
        return;
      }

      // 🔹 2. Criar resumo com atividades
      const resumo = atividades
        .map((a: any) => `- ${a.titulo || a.nome || "Atividade"} (${a.horario || "sem horário"})`)
        .join("\n");

      // 🔹 3. Mandar para Gemini
      const resposta = await getInsights({
        system: "Analista de produtividade",
        prompt: `Aqui estão as atividades do dia:\n${resumo}\n\nFaça um resumo do dia e gere insights práticos para melhorar a rotina.`
      });

      setInsight(resposta);
      setOpenModal(true);
    } catch (error) {
      console.error("Erro ao gerar insights:", error);
      setInsight("Erro ao gerar insights. Tente novamente.");
      setOpenModal(true);
    }

    setLoading(false);
  };

  return (
    <div className="mb-8 text-center">
      {/* Botão principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={gerarInsights}
          disabled={loading}
          variant="gradient"
          size="lg"
          className="shadow-elegant hover:shadow-glow"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {loading ? "Gerando..." : "Gerar Insights da IA"}
        </Button>
      </motion.div>

      {/* Modal para exibir insights */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-lg rounded-2xl shadow-xl bg-white">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle className="text-lg font-bold text-[hsl(238.67,89.73%,78.44%)]">
              ✨ Insights do Dia
            </DialogTitle>
            <button
              onClick={() => setOpenModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </DialogHeader>

          <div className="mt-4 text-left">
            {insight ? (
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {insight}
              </p>
            ) : (
              <p className="text-gray-400">Gerando insights...</p>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setOpenModal(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
