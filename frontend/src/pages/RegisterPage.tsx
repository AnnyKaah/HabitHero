import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { apiService } from "./apiService";

interface RegisterPageProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export default function RegisterPage({
  setIsAuthenticated,
}: RegisterPageProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await apiService<{ token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      localStorage.setItem("authToken", data.token);
      setIsAuthenticated(true);
      toast.success("Sua lenda começa agora!");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ocorreu um erro.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center min-h-screen text-center p-4 overflow-hidden bg-[#1e0a3c]"
    >
      {/* Fundo gradiente animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#2c024c] via-[#5b21b6]/50 to-[#1e0a3c] z-0"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Nuvens flutuantes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-48 h-24 bg-white/10 rounded-full blur-3xl"
          style={{
            top: `${10 + i * 10}%`,
            left: `${Math.random() * 90}%`,
          }}
          animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
          transition={{
            duration: 20 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i,
          }}
        />
      ))}

      {/* Estrelas flutuantes */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, 5, 0], x: [0, 5, 0], opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        // Adicionado z-10 para ficar sobre o fundo
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-brand-slate/50 border border-brand-light-slate rounded-2xl shadow-2xl p-8 backdrop-blur-lg">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-bold text-brand-purple mb-2">
              Crie sua Lenda
            </h1>
            <p className="text-slate-400">
              Forje seu caminho e comece a conquistar hábitos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Seu nome de herói"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-brand-dark border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-brand-dark border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="Crie uma senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-brand-dark border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-brand-purple text-white font-bold py-3 px-5 rounded-lg hover:bg-brand-purple/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus size={20} />
              {isLoading ? "Forjando..." : "Iniciar Jornada"}
            </motion.button>
          </form>

          <div className="text-center mt-6">
            <p className="text-slate-400">
              Já possui uma conta?{" "}
              <Link
                to="/login"
                className="font-semibold text-brand-cyan hover:underline"
              >
                Entre em seu reino
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
