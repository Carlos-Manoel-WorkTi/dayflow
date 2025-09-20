import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getInsights } from "@/api/geminai";
import { resumoPrompts } from "@/prompts/resumo";

export function InsightsButton({ atividades }: { atividades: any[] }) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const gerarInsights = async () => {
    if (!atividades || atividades.length === 0) {
      setInsight("Nenhuma atividade registrada neste dia.");
      setOpenModal(true);
      return;
    }

    setLoading(true);
    setOpenModal(true);

    try {
      const resposta = await getInsights({
        system: resumoPrompts.diario,
        prompt: `${atividades}`,
      });

      setInsight(resposta.text);
    } catch (err) {
      console.error(err);
      setInsight("❌ Erro ao gerar insights.");
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!insight) return;
    navigator.clipboard.writeText(insight);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={gerarInsights}
          disabled={loading}
          variant="gradient"
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {loading ? "Gerando..." : "Gerar Insights da IA"}
        </Button>
      </motion.div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-3xl rounded-2xl shadow-xl bg-white max-h-[90vh] flex flex-col">
          <div className="flex flex-col flex-1">
            <div className="p-4 border-b">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-primary">
                  ✨ Insights do Dia
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <p className="text-gray-400 animate-pulse">⏳ Gerando insights...</p>
              ) : insight ? (
                <div className="prose prose-sm max-w-none text-gray-800">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {insight}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-400">Nenhum insight disponível.</p>
              )}
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              {insight && (
                <Button variant="secondary" onClick={copyToClipboard}>
                  <Copy size={16} className="mr-1" />
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              )}
              <Button variant="outline" onClick={() => setOpenModal(false)}>
                <X size={16} className="mr-1" />
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
