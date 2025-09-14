// src/pages/ProfilePage.tsx
import { useUser } from "@/contexts/UserContext";
import { useDayFlow } from "@/hooks/useDayFlow";
import { useState } from "react";
import { ArrowLeftFromLine, User, Calendar, CheckCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { user, getAvatar } = useUser();
  const { dayProcesses } = useDayFlow();
  const navigate = useNavigate();

  const completedDays = dayProcesses.filter((d) => d.finalizado).length;
  const totalActivities = dayProcesses.reduce((sum, d) => sum + d.activities.length, 0);

  return (
    <div className="flex flex-col h-screen bg-gray-50 ">
      {/* Header */}
      <header className="flex items-center p-4 bg-white shadow-sm border-b">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <ArrowLeftFromLine className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold ml-4 text-indigo-700">Perfil</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 md:pb-6">
        {/* Card do Usuário */}
        <section className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-4">
          {user && (
            <>
              {user.photo ? (
                <img
                  src={getAvatar()}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-indigo-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-indigo-400">
                  {getAvatar()}
                </div>
              )}
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <Button
                variant="outline"
                className="mt-2 px-6"
                onClick={() => alert("Funcionalidade de editar perfil")}
              >
                Editar Perfil
              </Button>
            </>
          )}
        </section>

        {/* Estatísticas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="text-lg font-bold">{completedDays}</span>
            <span className="text-gray-500 text-sm">Dias concluídos</span>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-bold">{totalActivities}</span>
            <span className="text-gray-500 text-sm">Atividades totais</span>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-500" />
            <span className="text-lg font-bold">{dayProcesses.length}</span>
            <span className="text-gray-500 text-sm">Dias registrados</span>
          </div>
        </section>

        {/* Botão de Logout */}
        <section className="bg-white rounded-2xl shadow p-4">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => alert("Logout")}
          >
            Sair
          </Button>
        </section>
      </main>
    </div>
  );
};
