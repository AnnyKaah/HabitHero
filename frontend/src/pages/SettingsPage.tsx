import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Shield, Mail } from "lucide-react";
import { changePassword, changeEmail } from "../api";

const SettingsPage: React.FC = () => {
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPasswordForm,
  } = useForm();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
    reset: resetEmailForm,
  } = useForm();

  const onPasswordSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("As novas senhas não coincidem.");
      return;
    }
    try {
      const response = await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success(response.message);
      resetPasswordForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Falha ao alterar a senha."
      );
    }
  };

  const onEmailSubmit = async (data: any) => {
    try {
      const response = await changeEmail({
        newEmail: data.newEmail,
        password: data.currentPasswordForEmail,
      });
      toast.success(response.message);
      resetEmailForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Falha ao alterar o e-mail."
      );
    }
  };

  const inputClass =
    "mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
  const labelClass = "block text-sm font-medium text-slate-300";

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl w-full text-white">
      <h1 className="text-3xl font-bold mb-8">Configurações da Conta</h1>

      {/* Formulário de Alteração de Senha */}
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Shield className="mr-2" /> Alterar Senha
        </h2>
        <form
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="space-y-4"
        >
          <div>
            <label htmlFor="oldPassword" className={labelClass}>
              Senha Atual
            </label>
            <input
              type="password"
              id="oldPassword"
              className={inputClass}
              {...registerPassword("oldPassword", {
                required: "Senha atual é obrigatória",
              })}
            />
            {passwordErrors.oldPassword && (
              <p className="text-red-400 text-sm mt-1">
                {String(passwordErrors.oldPassword.message)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="newPassword" className={labelClass}>
              Nova Senha
            </label>
            <input
              type="password"
              id="newPassword"
              className={inputClass}
              {...registerPassword("newPassword", {
                required: "Nova senha é obrigatória",
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres",
                },
              })}
            />
            {passwordErrors.newPassword && (
              <p className="text-red-400 text-sm mt-1">
                {String(passwordErrors.newPassword.message)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={inputClass}
              {...registerPassword("confirmPassword", {
                required: "Confirmação de senha é obrigatória",
              })}
            />
            {passwordErrors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {String(passwordErrors.confirmPassword.message)}
              </p>
            )}
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
              disabled={isPasswordSubmitting}
            >
              {isPasswordSubmitting ? "Salvando..." : "Salvar Senha"}
            </button>
          </div>
        </form>
      </div>

      {/* Formulário de Alteração de E-mail */}
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Mail className="mr-2" /> Alterar E-mail
        </h2>
        <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
          <div>
            <label htmlFor="newEmail" className={labelClass}>
              Novo E-mail
            </label>
            <input
              type="email"
              id="newEmail"
              className={inputClass}
              {...registerEmail("newEmail", {
                required: "Novo e-mail é obrigatório",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Formato de e-mail inválido",
                },
              })}
            />
            {emailErrors.newEmail && (
              <p className="text-red-400 text-sm mt-1">
                {String(emailErrors.newEmail.message)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="currentPasswordForEmail" className={labelClass}>
              Confirme sua Senha
            </label>
            <input
              type="password"
              id="currentPasswordForEmail"
              className={inputClass}
              {...registerEmail("currentPasswordForEmail", {
                required: "Sua senha atual é obrigatória para confirmar",
              })}
            />
            {emailErrors.currentPasswordForEmail && (
              <p className="text-red-400 text-sm mt-1">
                {String(emailErrors.currentPasswordForEmail.message)}
              </p>
            )}
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
              disabled={isEmailSubmitting}
            >
              {isEmailSubmitting ? "Salvando..." : "Salvar E-mail"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
