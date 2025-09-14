// src/pages/NotificationsPage.tsx
import { useState, useEffect } from "react";
import { useDayFlow } from "@/hooks/useDayFlow";
import { format } from "date-fns";
import { Bell, BotMessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "user" | "ai";
  date: string;
  urgent?: boolean;
}

export const NotificationsPage = () => {
  const { dayProcesses } = useDayFlow();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const userNotifications: Notification[] = dayProcesses
      .filter((d) => !d.finalizado && d.activities.length > 0)
      .map((d) => ({
        id: d.id,
        title: "Dia incompleto",
        message: `Você ainda não finalizou o dia ${format(new Date(d.date), "dd/MM/yyyy")}`,
        type: "user",
        date: d.date,
        urgent: true,
      }));

    const aiNotifications: Notification[] = [
      {
        id: "ai-1",
        title: "💡 Dica de produtividade",
        message: "Tente organizar suas atividades mais importantes no início do dia.",
        type: "ai",
        date: new Date().toISOString(),
      },
      {
        id: "ai-2",
        title: "🛌 Sugestão de descanso",
        message: "Percebi que você tem vários dias consecutivos de atividades intensas. Faça pausas!",
        type: "ai",
        date: new Date().toISOString(),
      },
    ];

    setNotifications([...userNotifications, ...aiNotifications].sort((a, b) => b.date.localeCompare(a.date)));
  }, [dayProcesses]);

  const typeStyles = {
    user: "bg-blue-50 border-blue-400",
    ai: "bg-purple-50 border-purple-400",
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Bell className="w-8 h-8 text-primary" /> Notificações
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center mt-20 text-lg">Nenhuma notificação por enquanto.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`border-l-8 ${typeStyles[n.type]} hover:scale-105 transition-transform shadow-md cursor-pointer`}
            >
              <CardContent className="relative">
                {/* Badge de urgência */}
                {n.urgent && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs">
                    Urgente
                  </Badge>
                )}

                {/* Ícone por tipo */}
                <div className="flex items-center gap-3 mb-2">
                  {n.type === "ai" ? (
                    <BotMessageSquare className="w-6 h-6 text-purple-600" />
                  ) : (
                    <Bell className="w-6 h-6 text-blue-600" />
                  )}
                  <h3 className="font-semibold text-lg">{n.title}</h3>
                </div>

                {/* Mensagem */}
                <p className="text-gray-700 mb-3">{n.message}</p>

                {/* Data */}
                <span className="text-xs text-gray-400">
                  {format(new Date(n.date), "dd/MM/yyyy HH:mm")}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
