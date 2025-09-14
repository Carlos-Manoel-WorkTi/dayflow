// src/pages/AIInsightsPage.tsx
import { useState, useRef, useEffect } from "react";
import { useDayFlow } from "@/hooks/useDayFlow";
import { format } from "date-fns";
import { ArrowLeft, Plus } from "lucide-react";

interface Message {
  from: "user" | "ai";
  text: string;
}

export const InsightsPage = () => {
  const { dayProcesses } = useDayFlow();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMsg: Message = { from: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Resposta simulada da IA
    setTimeout(() => {
      const aiMsg: Message = {
        from: "ai",
        text: generateAIInsight(msg, dayProcesses),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  const recentDays = dayProcesses
    .filter((d) => d.activities.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header com botão de voltar */}
      <header className="p-4 border-b bg-white shadow-sm flex items-center gap-4">
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5 text-indigo-700" />
        </button>
        <h1 className="text-2xl font-bold text-indigo-700 flex-1 text-center">
          🤖 Insights AI
        </h1>
      </header>

      {/* Cards de dias recentes */}
      <div className="flex justify-center gap-4 overflow-x-auto p-4">
        {recentDays.map((day) => (
          <div
            key={day.id}
            className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-400 text-white p-4 rounded-2xl shadow-lg cursor-pointer transition transform hover:scale-105"
            onClick={() => handleSend(`Me mostre insights do dia ${day.date}`)}
          >
            <div className="text-center font-semibold text-lg">
              {format(new Date(day.date), "dd/MM/yyyy")}
            </div>
            <div className="text-center text-sm mt-1">
              {day.activities.length} {day.activities.length > 1 ? "atividades" : "atividade"}
            </div>
          </div>
        ))}
      </div>

      {/* Área do chat */}
      <div className="flex-1 flex flex-col items-center overflow-hidden relative">
        <div className="w-full  flex-1 flex flex-col overflow-y-auto p-4 gap-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow ${
                  m.from === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/* Barra de escrita tipo WhatsApp */}
        <div className="absolute bottom-0 w-full  flex items-center gap-2 p-4 bg-white border-t shadow-inner">
          {/* Botão + */}
          <button
            onClick={() => handleSend("Adicionar nova instrução")}
            className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition shadow"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem ou pesquise uma atividade..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* Botão enviar */}
          <button
            onClick={() => handleSend()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

// Função simples para gerar respostas da IA
const generateAIInsight = (input: string, dayProcesses: any[]) => {
  const lower = input.toLowerCase();

  if (lower.includes("mais produtivo")) {
    const most = dayProcesses.sort((a, b) => b.activities.length - a.activities.length)[0];
    return most
      ? `Seu dia mais produtivo foi ${most.date} com ${most.activities.length} atividades.`
      : "Ainda não há dados suficientes para isso.";
  }

  if (lower.includes("tag") || lower.includes("categoria")) {
    const tagsCount: Record<string, number> = {};
    dayProcesses.forEach((d) =>
      d.activities.forEach((a: any) => a.tags.forEach((t: any) => tagsCount[t.name] = (tagsCount[t.name] || 0) + 1))
    );
    const sortedTags = Object.entries(tagsCount).sort((a, b) => b[1] - a[1]);
    return sortedTags.length
      ? `Sua categoria mais usada é ${sortedTags[0][0]} com ${sortedTags[0][1]} atividades.`
      : "Não há categorias registradas ainda.";
  }

  if (lower.includes("dia")) {
    return "Aqui está um resumo das atividades desse dia...";
  }

  return "Hmm... estou analisando seus dados e te respondo em breve! 🚀";
};
