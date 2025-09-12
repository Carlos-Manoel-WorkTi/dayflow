import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  Settings,
  LogOut,
  SunMoon,
  LucideHistory,
  SkipBack,
  Bell,
  BookOpen,
  PieChart,
  BrainCircuit,
  CalendarDays,
  Menu,
  X,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logoImg from "@/assets/logo.png";

export const menuItems = [
  { label: "Início", icon: Home, path: "/" },
  { label: "Atividades", icon: Calendar, path: "/day-process" },
  { label: "Notificações", icon: Bell, path: "/notifications" },
  { label: "Agenda", icon: CalendarDays, path: "/extra-activity" },
  { label: "Insights", icon: BrainCircuit, path: "/insights" },
  { label: "Relatórios", icon: PieChart, path: "/reports" },
  { label: "Histórico", icon: LucideHistory, path: "/history" },
  { label: "Temas", icon: SunMoon, path: "/themes" },
  { label: "Configurações", icon: Settings, path: "/settings" },
  { label: "Documentação", icon: BookOpen, path: "/docs" },
];

export function NavBar({ open, setOpen }) {
  const { user, getAvatar, clearUser } = useUser();
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <>
      {/* Sidebar Desktop */}
      <motion.aside
        animate={{ width: open ? 256 : 64 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="hidden md:flex fixed top-0 left-0 h-screen bg-white border-r shadow-md flex-col justify-between z-40"
      >
        {/* Topo */}
        <div className="flex items-center p-4 border-b relative">
          <img src={logoImg} alt="Logo" className="w-8 h-8" />
          {open && (
            <h1
              className="text-xl font-bold ml-4"
              style={{ color: "hsl(238.67deg 89.73% 78.44%)" }}
            >
              DayFlow
            </h1>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1 mt-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition"
            >
              <item.icon className="w-6 h-6" />
              {open && item.label}
            </Link>
          ))}
        </nav>

        {/* Perfil + sair */}
        {user && (
          <div className="border-t p-2 w-full">
            <div className={`flex items-center justify-between w-full`}>
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
                {open && <span className="font-medium">{user.name}</span>}
              </div>

              {open && (
                <button
                  onClick={clearUser}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-red-500 hover:bg-red-100 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              )}
            </div>

            {!open && (
              <button
                onClick={clearUser}
                className="mt-3 w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-100 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </motion.aside>

      {/* Botão toggle Desktop */}
      <motion.button
        onClick={() => setOpen(!open)}
        animate={{ left: open ? 216 : 64 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="hidden md:flex fixed top-5 z-50 w-7 h-7 items-center justify-center rounded-full bg-transparent hover:bg-gray-200/20"
      >
        {open ? (
          <SkipBack size={18} className="text-[rgb(156,91,255)]" />
        ) : (
          <Menu size={18} className="text-[rgb(156,91,255)]" />
        )}
      </motion.button>

      {/* Botão menu Mobile (só aparece na Home) */}
      {isHome && (
        <button
          onClick={() => setMobileMenu(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Bottom Nav Mobile (atalhos principais) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around items-center py-2 md:hidden z-40">
        {menuItems.slice(0, 5).map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex flex-col items-center text-gray-600 hover:text-primary transition"
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Drawer Mobile (só abre se estiver na Home) */}
      {isHome && mobileMenu && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed inset-0 bg-black/40 z-50 flex"
          onClick={() => setMobileMenu(false)}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-64 h-full bg-white shadow-lg p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <img src={logoImg} alt="Logo" className="w-8 h-8" />
              <button onClick={() => setMobileMenu(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto custom-scrollbar">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
