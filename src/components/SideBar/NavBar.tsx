import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  LucideHistory,
  BrainCircuit,
  PieChart,
  SunMoon,
  Settings,
  BookOpen,
  Bell,
  X,
  ArrowRightFromLine,
  ArrowLeft,
  ArrowLeftFromLine,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logoImg from "@/assets/logo.png";

export const menuItems = [
  { label: "Início", icon: Home, path: "/" },
  { label: "Atividades", icon: Calendar, path: "/day-process" },
  { label: "Notificações", icon: Bell, path: "/notifications" },
  { label: "Agenda", icon: SunMoon, path: "/extra-activity" },
  { label: "Insights", icon: BrainCircuit, path: "/insights" },
  { label: "Relatórios", icon: PieChart, path: "/reports" },
  { label: "Histórico", icon: LucideHistory, path: "/history" },
  { label: "Temas", icon: SunMoon, path: "/themes" },
  { label: "Configurações", icon: Settings, path: "/settings" },
  { label: "Documentação", icon: BookOpen, path: "/docs" },
];

export function NavBar() {
  const { user, getAvatar, clearUser } = useUser();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const bottomNavItems = menuItems.filter((item) =>
    ["Início", "Histórico", "Atividades","Notificações"].includes(item.label)
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <motion.aside
        className="hidden md:flex fixed top-0 left-0 h-screen bg-white border-r shadow-md flex-col justify-between z-40 w-64"
      >
        {/* Topo */}
        <div className="flex items-center p-4 border-b relative">
          <img src={logoImg} alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold ml-4 text-purple-600">DayFlow</h1>
        </div>

        {/* Navegação Desktop */}
        <nav className="flex-1 mt-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition"
            >
              <item.icon className="w-6 h-6" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Perfil Desktop */}
{user && (
  <div className="border-t mt-3 p-3 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      {user.photo ? (
        <img
          src={getAvatar()}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          {getAvatar()}
        </div>
      )}
      <span className="font-medium text-sm">{user.name}</span>
    </div>
    <button
      onClick={clearUser}
      className="flex items-center gap-2 px-2 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
    >
      <ArrowLeftFromLine className="w-4 h-4" />
      Sair
    </button>
  </div>
)}

      </motion.aside>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around items-center py-2 md:hidden z-40">
        {bottomNavItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex flex-col items-center text-gray-600 hover:text-primary transition"
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}

        {/* Botão Perfil / Mais Serviços */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center text-gray-600 hover:text-primary transition"
        >
          {user?.photo ? (
            <img
              src={getAvatar()}
              alt={user.name}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              {getAvatar()}
            </div>
          )}
          <span className="text-xs">Perfil</span>
        </button>
      </nav>

      {/* Drawer Mobile com todos os serviços */}
      {drawerOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed inset-0 bg-black/40 z-50 flex justify-end"
          onClick={() => setDrawerOpen(false)}
        >
          <motion.div
            className="w-64 h-full bg-white shadow-lg p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <h2 className="text-lg font-bold">Serviços</h2>
              <button onClick={() => setDrawerOpen(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto custom-scrollbar">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}

              {/* Botão de Logout no Drawer */}
              {user && (
                <button
                  onClick={clearUser}
                  className="mt-4 w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-100 rounded-lg"
                >
                
                  Sair
                </button>
              )}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
