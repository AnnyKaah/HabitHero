import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import User from "../models/User.js";
import {
  RegisterDTO,
  LoginDTO,
  ChangePasswordDTO,
  ChangeEmailDTO,
  UpdateProfileDTO,
} from "./auth.dto.js";

// Em um cenário ideal, estes seriam importados de um arquivo de erros customizados
// Ex: import { ValidationError, NotFoundError, AuthenticationError } from '../errors';
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export const AuthService = {
  async register(data: RegisterDTO) {
    const { username, email, password } = data;
    if (!username || !email || !password || password.length < 6) {
      throw new ValidationError(
        "Usuário, e-mail e senha (mínimo 6 caracteres) são obrigatórios."
      );
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) throw new Error("Este nome de usuário já existe.");

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) throw new Error("Este e-mail já está em uso.");

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      passwordHash,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      totalXp: 0,
      unlockedAchievementIds: [],
      avatarId: "avatar1",
      role: "user",
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || "your_default_secret",
      { expiresIn: "1h" }
    );

    return {
      message: "Usuário registrado com sucesso!",
      user: { id: newUser.id, username: newUser.username },
      token,
    };
  },

  async login(data: LoginDTO) {
    const { email, password } = data;
    if (!email || !password)
      throw new ValidationError("E-mail e senha são obrigatórios.");

    const user = await User.findOne({ where: { email } });
    if (!user) throw new AuthenticationError("Credenciais inválidas");

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid)
      throw new AuthenticationError("Credenciais inválidas");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "your_default_secret",
      { expiresIn: "1h" }
    );

    return { message: "Login bem-sucedido!", token };
  },

  async forgotPassword(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) return; // Não vaza informação se o e-mail existe

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await transporter.sendMail({
      from: '"HabitHero" <noreply@habithero.com>',
      to: user.email,
      subject: "Redefinição de Senha - HabitHero",
      html: `<p>Você solicitou uma redefinição de senha. Clique no link a seguir para continuar: <a href="${resetUrl}">${resetUrl}</a></p><p>Este link expira em 10 minutos.</p>`,
    });

    // Apenas loga a URL de preview se uma for gerada (ao usar ethereal.email)
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(
        "E-mail de redefinição enviado! Veja o preview em: %s",
        previewUrl
      );
    }
  },

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) throw new AuthenticationError("Token inválido ou expirado.");

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
  },

  async changePassword(userId: number, data: ChangePasswordDTO) {
    const { oldPassword, newPassword } = data;
    if (!oldPassword || !newPassword || newPassword.length < 6) {
      throw new ValidationError(
        "Senha antiga e nova senha (mínimo 6 caracteres) são obrigatórias."
      );
    }

    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError("Usuário não encontrado.");

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.passwordHash
    );
    if (!isPasswordValid)
      throw new AuthenticationError("Senha antiga incorreta.");

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
  },

  async changeEmail(userId: number, data: ChangeEmailDTO) {
    const { newEmail, password } = data;
    if (!newEmail || !password)
      throw new ValidationError("Novo e-mail e senha são obrigatórios.");

    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError("Usuário não encontrado.");

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new AuthenticationError("Senha incorreta.");

    user.email = newEmail;
    await user.save();
  },

  async updateProfile(userId: number, updates: UpdateProfileDTO) {
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError("Usuário não encontrado.");

    if (updates.username) user.username = updates.username;
    if (updates.avatarId) user.avatarId = updates.avatarId;

    await user.save();
    return user;
  },
};
