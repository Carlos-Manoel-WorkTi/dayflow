import { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/SideBar/NavBar";
import { motion } from "framer-motion";

export function MainLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar (desktop) */}
      <NavBar open={open} setOpen={setOpen} />

      {/* Conteúdo principal */}
      <motion.main
        animate={{ marginLeft: open ? 256 : 64 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="flex-1 overflow-y-auto"
      >
        <Outlet />
      </motion.main>

      {/* Bottom nav (mobile) */}
      <div className="md:hidden">
        <NavBar open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
