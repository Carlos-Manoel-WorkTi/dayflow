import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface LoginScreenProps {
  onEmailLogin: (email: string, name: string) => void;
  onGoogleLogin: () => void;
  onFacebookLogin?: () => void;
}

export function LoginScreen({ onEmailLogin, onGoogleLogin, onFacebookLogin }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onEmailLogin(email, name);
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

        {/* Inputs */}
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

        {/* Botão Email */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" /> Entrar com Email
        </motion.button>

        <div className="text-center text-gray-400 mt-2">ou entre com</div>

        {/* Botão Google */}
        <motion.button
          type="button"
          onClick={onGoogleLogin}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full p-3 rounded-xl border border-gray-300 flex items-center justify-center gap-3 font-medium shadow-sm hover:shadow-md transition"
        >
          <FcGoogle className="w-6 h-6" /> Google
        </motion.button>

        {/* Botão Facebook */}
        {onFacebookLogin && (
          <motion.button
            type="button"
            onClick={onFacebookLogin}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full p-3 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-3 font-medium shadow-md hover:shadow-lg transition"
          >
            <FaFacebook className="w-6 h-6" /> Facebook
          </motion.button>
        )}
      </motion.form>
    </div>
  );
}
