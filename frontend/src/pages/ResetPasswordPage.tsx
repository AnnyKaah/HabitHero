import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    if (!token) {
      toast.error("Token de redefinição inválido ou ausente.");
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      const response = await resetPassword({ token, password: data.password });
      toast.success(response.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Falha ao redefinir a senha."
      );
    }
  };

  const inputClass =
    "mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Redefinir Senha
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300"
            >
              Nova Senha
            </label>
            <input
              type="password"
              id="password"
              className={inputClass}
              {...register("password", {
                required: "Nova senha é obrigatória",
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {String(errors.password.message)}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-300"
            >
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={inputClass}
              {...register("confirmPassword", {
                required: "Confirmação de senha é obrigatória",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {String(errors.confirmPassword.message)}
              </p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Redefinir Senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
