import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  },

  getMe: async (req: Request, res: Response) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  },

  updateMe: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const updatedUser = await AuthService.updateProfile(userId, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  },

  forgotPassword: async (req: Request, res: Response) => {
    try {
      await AuthService.forgotPassword(req.body.email);
      res.status(200).json({
        message:
          "Se um usuário com este e-mail existir, um link de redefinição de senha foi enviado.",
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    try {
      await AuthService.resetPassword(req.params.token, req.body.password);
      res.status(200).json({ message: "Senha redefinida com sucesso!" });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  },

  changePassword: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      await AuthService.changePassword(userId, req.body);
      res.status(200).json({ message: "Senha alterada com sucesso!" });
    } catch (error) {
      const status = (error as Error).message.includes("incorreta") ? 401 : 400;
      res.status(status).json({ message: (error as Error).message });
    }
  },

  changeEmail: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      await AuthService.changeEmail(userId, req.body);
      res.status(200).json({ message: "E-mail alterado com sucesso!" });
    } catch (error) {
      const status = (error as Error).message.includes("incorreta") ? 401 : 400;
      res.status(status).json({ message: (error as Error).message });
    }
  },
};
