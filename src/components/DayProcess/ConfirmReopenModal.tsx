import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ConfirmReopenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmReopenModal = ({ isOpen, onClose, onConfirm }: ConfirmReopenModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-xl p-6 w-80 shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-lg font-bold text-center">Dia já existe</h2>
        <p className="text-sm text-muted-foreground text-center">
          Esse dia já foi finalizado. Deseja reabrir para edição?
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={onConfirm}>Reabrir</Button>
        </div>
      </motion.div>
    </div>
  );
};
