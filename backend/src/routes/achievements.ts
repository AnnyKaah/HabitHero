import { Router, Request, Response } from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Apply protection to all achievement routes
router.use(protect);

// POST /api/achievements/unlock - Unlock an achievement for the logged-in user
router.post("/unlock", async (req: Request, res: Response) => {
  const { achievementId } = req.body;
  const userId = req.user!.id;

  if (!achievementId) {
    return res.status(400).json({ message: "achievementId is required." });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Add the new achievement ID if it's not already there
    if (!user.unlockedAchievementIds.includes(achievementId)) {
      user.unlockedAchievementIds = [
        ...user.unlockedAchievementIds,
        achievementId,
      ];
      await user.save();
    }

    res
      .status(200)
      .json({ unlockedAchievementIds: user.unlockedAchievementIds });
  } catch (error) {
    res.status(500).json({ message: "Error unlocking achievement." });
  }
});

export default router;
