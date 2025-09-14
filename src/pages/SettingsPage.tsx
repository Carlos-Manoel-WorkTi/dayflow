// src/pages/SettingsPage.tsx
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { SunMoon, Bell, User, Palette, ArrowLeftFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const SettingsPage = () => {
  const { user, getAvatar, clearUser } = useUser();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center p-4 bg-white shadow-sm border-b">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <ArrowLeftFromLine className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold ml-4 text-indigo-700">Configurações</h1>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Perfil */}
        <section className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" /> Perfil
          </h2>
          {user && (
            <div className="flex items-center gap-4">
              {user.photo ? (
                <img
                  src={getAvatar()}
                  alt={user.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
                  {getAvatar()}
                </div>
              )}
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>
          )}
        </section>

        {/* Preferências */}
        <section className="bg-white rounded-2xl shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-500" /> Aparência
          </h2>
          <div className="flex items-center justify-between">
            <span>Modo Escuro</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="toggle toggle-primary"
            />
          </div>
        </section>

        {/* Notificações */}
        <section className="bg-white rounded-2xl shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" /> Notificações
          </h2>
          <div className="flex items-center justify-between">
            <span>Ativar notificações</span>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              className="toggle toggle-primary"
            />
          </div>
        </section>

        {/* Logout */}
        {user && (
          <section className="bg-white rounded-2xl shadow p-4">
            <Button
              variant="destructive"
              className="w-full flex items-center justify-center gap-2"
              onClick={clearUser}
            >
              <ArrowLeftFromLine className="w-5 h-5" />
              Sair da conta
            </Button>
          </section>
        )}
      </main>
    </div>
  );
};
