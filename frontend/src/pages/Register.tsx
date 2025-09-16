// c:\Users\User\Downloads\VS CODE PROJETOS\HabitHero\frontend\src\pages\Register.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Check, X, User, Mail, Lock, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { register } from "../api";
import { PageLayout } from "../components/PageLayout";

interface RegisterPageProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export default function RegisterPage({
  setIsAuthenticated,
}: RegisterPageProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
    if (!allCriteriaMet) {
      toast.error("Sua senha não atende a todos os critérios de segurança.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await register({ username, email, password });

      toast.success("Registro bem-sucedido! Entrando...");
      localStorage.setItem("authToken", data.token); // Salva o token
      setIsAuthenticated(true); // Atualiza o estado no App.tsx

      // Redireciona para o painel principal
      navigate("/", { replace: true });
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
              Crie sua Lenda
            </h1>
            <p className="text-slate-400">
              Forje seu caminho e comece a conquistar hábitos.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
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
                autoComplete="email"
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
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-brand-dark border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all"
              />
            </div>

            {password.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400 p-2 bg-brand-dark/30 rounded-md">
                <CriteriaItem
                  met={passwordCriteria.length}
                  text="Mín. 8 caracteres"
                />
                <CriteriaItem
                  met={passwordCriteria.uppercase}
                  text="1 Maiúscula"
                />
                <CriteriaItem
                  met={passwordCriteria.lowercase}
                  text="1 Minúscula"
                />
                <CriteriaItem met={passwordCriteria.number} text="1 Número" />
                <CriteriaItem
                  met={passwordCriteria.specialChar}
                  text="1 Especial"
                />
              </div>
            )}

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
    </PageLayout>
  );
}

const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2">
    {met ? (
      <Check size={16} className="text-green-500" />
    ) : (
      <X size={16} className="text-red-500" />
    )}
    <span className={met ? "text-slate-300" : "text-slate-500"}>{text}</span>
  </div>
);
