import { useState } from "react";
import { motion } from "framer-motion";

interface LoginScreenProps {
  onLogin: (user: { name: string; email: string; photo?: string }) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onLogin({ name, email });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-6">
          Bem-vindo ao <span className="text-purple-600">DayFlow</span>
        </h2>

        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
        />

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-lg"
        >
          Entrar
        </motion.button>

        <p className="text-sm text-center text-gray-500 mt-2">
          Organize seu dia e aumente sua produtividade ✨
        </p>
      </motion.form>
    </div>
  );
}
