import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Histórico", icon: Home },
    { path: "/day-process", label: "Processo do Dia", icon: Calendar },
  ];

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-2",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}