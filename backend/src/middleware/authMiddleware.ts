import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Estendendo a interface Request do Express para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_default_secret"
      ) as { id: number };
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["passwordHash"] },
      });

      if (!user) {
        // Lança um erro se o usuário do token não for encontrado no DB
        return res
          .status(401)
          .json({ message: "Não autorizado, usuário não encontrado" });
      }

      req.user = user; // Agora 'user' é garantidamente do tipo User, não null.
      next(); // Prossegue para a próxima rota/middleware
    } catch (error) {
      return res.status(401).json({ message: "Não autorizado, token falhou" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Não autorizado, sem token" });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Acesso negado, requer privilégios de administrador" });
  }
};
