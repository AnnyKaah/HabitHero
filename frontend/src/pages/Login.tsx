import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { LogIn, User, Lock } from "lucide-react";
import { login } from "../api";
import { PageLayout } from "../components/PageLayout";

interface LoginPageProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export default function LoginPage({ setIsAuthenticated }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Por favor, preencha o e-mail e a senha.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await login({ email, password });

      localStorage.setItem("authToken", data.token); // Salva o token
      setIsAuthenticated(true); // Atualiza o estado no App.tsx
      toast.success("Bem-vindo de volta, Herói!");
      navigate("/"); // Redireciona para o painel principal
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ocorreu um erro.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <motion.div className="w-full max-w-md">
        <div className="bg-brand-slate/50 border border-brand-light-slate rounded-2xl shadow-2xl p-8 backdrop-blur-lg">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-bold text-brand-purple mb-2">
              Retorne à Jornada
            </h1>
            <p className="text-slate-400">
              Suas missões e seu progresso aguardam por você.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder="Seu e-mail de herói"
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
                placeholder="Sua senha secreta"
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
              <LogIn size={20} />
              {isLoading ? "Entrando..." : "Entrar no Reino"}
            </motion.button>
          </form>

          <div className="text-center mt-6">
            <p className="text-slate-400">
              Ainda não é um herói?{" "}
              <Link
                to="/register"
                className="font-semibold text-brand-cyan hover:underline"
              >
                Crie sua lenda
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
}
