import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface DateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

const DateModal = ({ isOpen, onClose, onConfirm }: DateModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedDate) return;
    onConfirm(selectedDate);
    setSelectedDate("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-80 shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-lg font-bold">Escolha a data</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          max={new Date().toISOString().split("T")[0]} // impede datas futuras
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedDate}>
            Confirmar
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DateModal;
