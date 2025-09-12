import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  Settings,
  LogOut,
  SunMoon,
  LucideHistory,
  LampIcon,
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
  Users,
  Activity,
  Bell,
  BookOpen,
  PieChart,
  BrainCircuit,
  CalendarDays,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";
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
// { label: "Equipe", icon: Users, path: "/team" },

export function NavBar({ open, setOpen }) {
  const { user, getAvatar, clearUser } = useUser();

  return (
    <>
      {/* Sidebar */}
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
      {/* Avatar + Nome */}
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

      {/* Botão Sair */}
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

    {/* Se estiver colapsado, botão fica abaixo */}
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

      {/* Botão toggle unificado */}
<motion.button
  onClick={() => setOpen(!open)}
  animate={{ left: open ? 216 : 64 }}
  transition={{ type: "spring", stiffness: 100, damping: 20 }}
  className="hidden md:flex fixed top-5 z-50 w-7 h-7 flex items-center justify-center rounded-full bg-transparent hover:bg-gray-200/20 "
>
  {open ? (
    <SkipBack size={18} className="text-[rgb(156,91,255)]" />
  ) : (
    // <SkipForward size={18} className="text-white"  />
    <svg  xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-skip-forward-icon lucide-skip-forward"><path d="M21 4v16"/><path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/></svg>
  )}
</motion.button>
    </>
  );
}
