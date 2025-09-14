// src/pages/ReportsPage.tsx
import { useState } from "react";
import { useDayFlow } from "@/hooks/useDayFlow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const ReportsPage = () => {
  const { dayProcesses, commitmentData } = useDayFlow();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

  const completedDays = dayProcesses.filter((d) => d.finalizado);
  const pendingDays = dayProcesses.filter((d) => !d.finalizado);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Relatórios</h1>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent>
            <p className="text-sm text-gray-500">Dias finalizados</p>
            <p className="text-2xl font-bold">{completedDays.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent>
            <p className="text-sm text-gray-500">Dias pendentes</p>
            <p className="text-2xl font-bold">{pendingDays.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent>
            <p className="text-sm text-gray-500">Atividades totais</p>
            <p className="text-2xl font-bold">
              {dayProcesses.reduce((acc, d) => acc + d.activities.length, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de nível de compromisso */}
      <Card className="mb-6">
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">Compromisso ao longo do tempo</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={commitmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => formatDate(d)}
                minTickGap={20}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip
                formatter={(value: number) => [`${value}/10`, "Compromisso"]}
                labelFormatter={(label) => formatDate(label)}
              />
              <Line type="monotone" dataKey="level" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lista detalhada por dia */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Detalhes dos dias</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left border">Data</th>
                  <th className="p-2 text-left border">Atividades</th>
                  <th className="p-2 text-left border">Compromisso</th>
                  <th className="p-2 text-left border">Status</th>
                </tr>
              </thead>
              <tbody>
                {dayProcesses
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{formatDate(d.date)}</td>
                      <td className="p-2 border">{d.activities.length}</td>
                      <td className="p-2 border">{d.commitmentLevel || 0}/10</td>
                      <td className="p-2 border">
                        {d.finalizado ? (
                          <span className="text-green-600 font-medium">Finalizado</span>
                        ) : (
                          <span className="text-yellow-600 font-medium">Pendente</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
