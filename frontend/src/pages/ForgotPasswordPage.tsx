import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api";

const ForgotPasswordPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await forgotPassword(data.email);
      toast.success(response.message, { duration: 6000 });
    } catch (error) {
      // Mesmo em caso de erro, mostramos uma mensagem genérica para segurança
      toast.error("Ocorreu um erro. Por favor, tente novamente mais tarde.");
    }
  };

  const inputClass =
    "mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Recuperar Senha
        </h1>
        <p className="text-center text-slate-400 mb-6">
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className={inputClass}
              {...register("email", { required: true })}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Link de Recuperação"}
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
