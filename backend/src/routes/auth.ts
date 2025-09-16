import { Router } from "express";
import { Op } from "sequelize"; // Importação necessária para o AuthService
import { protect } from "../middleware/authMiddleware.js";
import { AuthController } from "../controllers/AuthController.js";

const router = Router();

// POST /api/auth/register
router.post("/register", AuthController.register);

// POST /api/auth/login
router.post("/login", AuthController.login);

// POST /api/auth/forgot-password
router.post("/forgot-password", AuthController.forgotPassword);

// POST /api/auth/reset-password/:token
router.post("/reset-password/:token", AuthController.resetPassword);

// GET /api/auth/me - Busca os dados do usuário logado
router.get("/me", protect, AuthController.getMe);

// PATCH /api/auth/me - Atualiza os dados do usuário logado
router.patch("/me", protect, AuthController.updateMe);

// PATCH /api/auth/change-password - Altera a senha do usuário
router.patch("/change-password", protect, AuthController.changePassword);

// PATCH /api/auth/change-email - Altera o e-mail do usuário
router.patch("/change-email", protect, AuthController.changeEmail);

export default router;
