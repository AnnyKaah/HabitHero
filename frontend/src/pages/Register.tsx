// c:\Users\User\Downloads\VS CODE PROJETOS\HabitHero\frontend\src\pages\Register.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // No changes needed here
import { Check, X } from "lucide-react";

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
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha no registro");
      }

      toast.success("Registro bem-sucedido! Entrando...");
      localStorage.setItem("authToken", data.token); // Salva o token
      setIsAuthenticated(true); // Atualiza o estado no App.tsx

      // Redireciona para o painel principal
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-deep-slate">
      <form
        onSubmit={handleRegister}
        className="bg-brand-slate/50 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold text-brand-cyan mb-6 text-center">
          Criar Conta
        </h1>
        <div className="mb-4">
          <label className="block text-slate-300 mb-2" htmlFor="username">
            Nome de Usuário
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-slate-200 border border-slate-400 text-black focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-slate-300 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-slate-200 border border-slate-400 text-black focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-slate-300 mb-2" htmlFor="password">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-slate-200 border border-slate-400 text-black focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-xs mt-2 text-slate-400">
            <CriteriaItem
              met={passwordCriteria.length}
              text="Pelo menos 8 caracteres"
            />
            <CriteriaItem
              met={passwordCriteria.uppercase}
              text="Uma letra maiúscula"
            />
            <CriteriaItem
              met={passwordCriteria.lowercase}
              text="Uma letra minúscula"
            />
            <CriteriaItem met={passwordCriteria.number} text="Um número" />
            <CriteriaItem
              met={passwordCriteria.specialChar}
              text="Um caractere especial"
            />
          </div>
        </div>
        <div className="mb-6">
          <label
            className="block text-slate-300 mb-2"
            htmlFor="confirm-password"
          >
            Confirmar Senha
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded bg-slate-200 border border-slate-400 text-black focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-purple text-white font-bold py-2 px-4 rounded hover:bg-brand-purple/80 transition-colors disabled:bg-brand-purple/50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Registrando..." : "Registrar"}
        </button>
        <p className="text-center text-sm text-slate-400 mt-4">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="font-medium text-brand-cyan hover:underline"
          >
            Faça login
          </Link>
        </p>
      </form>
    </div>
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
