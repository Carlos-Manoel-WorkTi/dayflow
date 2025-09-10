import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  onCreateDay: () => void;
  hasActiveDay: boolean;
}

export function Navigation({ onCreateDay, hasActiveDay }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNewDay = () => {
    if (typeof onCreateDay === "function") {
      if (!hasActiveDay) {
        onCreateDay();
      }
      navigate("/day-process");
    } else {
      console.error("onCreateDay não foi passado para Navigation!");
    }
  };

  const isDayProcess = location.pathname === "/day-process";
  const isCompletedDays = location.pathname === "/completed-days";

  return (
    <nav className="flex items-center gap-2">
      {/* Processo do Dia */}
      <Button
        asChild
        variant={isDayProcess ? "default" : "ghost"}
        size="sm"
        className="flex items-center gap-2"
      >
        <a href="/day-process">
          <Calendar className="w-4 h-4" />
          Processo do Dia
        </a>
      </Button>

      {/* Criar ou Continuar Dia */}
      <Button
        onClick={handleNewDay}
        variant={hasActiveDay ? "default" : "hero"}
        size="sm"
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {hasActiveDay ? "Continuar Dia" : "Novo Dia"}
      </Button>

      {/* Dias Finalizados */}
      <Button
        onClick={() => navigate("/completed-days")}
        variant={isCompletedDays ? "default" : "ghost"}
        size="sm"
        className="flex items-center gap-2"
      >
        <CheckCircle className="w-4 h-4" />
        Dias Finalizados
      </Button>
    </nav>
  );
}
