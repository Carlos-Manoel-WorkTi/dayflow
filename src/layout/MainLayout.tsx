import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/SideBar/NavBar";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMediaQuery } from "@/lib/utils";

export function MainLayout() {
  const [open, setOpen] = useState(true);

  // true se for desktop (>= 768px)
  const isDesktop = useMediaQuery({ minWidth: 768 });

  // Largura da sidebar: aberta 256px, minimizada 80px
  const sidebarWidth = open ? 256 : 80;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar desktop */}
      {isDesktop && <NavBar open={open} setOpen={setOpen} />}

      {/* Conteúdo principal */}
      <motion.main
        animate={{ marginLeft: isDesktop ? sidebarWidth : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="flex-1 overflow-y-auto"
      >
        <Outlet />
      </motion.main>

      {/* Bottom nav mobile */}
      {!isDesktop && <NavBar open={open} setOpen={setOpen} />}
    </div>
  );
}
