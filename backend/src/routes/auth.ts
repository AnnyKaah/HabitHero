import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password || password.length < 6) {
      return res.status(400).json({
        message:
          "Usuário, e-mail e senha (mínimo 6 caracteres) são obrigatórios.",
      });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Este nome de usuário já existe." });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Este e-mail já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
      // Initialize gamification fields
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      totalXp: 0,
      unlockedAchievementIds: [],
      avatarId: "avatar1",
      role: "user",
    });

    // Gerar o token JWT para o novo usuário (login automático)
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || "your_default_secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Usuário registrado com sucesso!",
      user: { id: newUser.id, username: newUser.username },
      token, // Envia o token para login automático
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "E-mail e senha são obrigatórios." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "your_default_secret",
      { expiresIn: "1h" } // Token expira em 1 hora
    );

    res.json({
      message: "Login bem-sucedido!",
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req: Request, res: Response) => {
  const { username } = req.body;
  // In a real application, you would:
  // 1. Find the user by username or email.
  // 2. Generate a unique, secure, and time-limited reset token.
  // 3. Save the token's hash to the user's record in the database.
  // 4. Use an email service (like SendGrid, Mailgun, or Nodemailer) to send a password reset link to the user's email.
  //    The link would contain the token, e.g., https://yourapp.com/reset-password?token=...

  // For this example, we'll just log the request and return a success message
  // to avoid leaking information about whether a user exists or not.
  console.log(`Password reset requested for username: ${username}`);
  res.status(200).json({
    message:
      "If a user with that username exists, a password reset email has been sent.",
  });
});

// GET /api/auth/me - Busca os dados do usuário logado
router.get("/me", protect, async (req: Request, res: Response) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: "Usuário não encontrado" });
  }
});

export default router;
