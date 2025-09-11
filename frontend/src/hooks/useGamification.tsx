import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { achievementsData, Achievement } from "../pages/achievementsData";

import bossImage1 from "../assets/boss-1.png";
import bossImage2 from "../assets/boss-2.png";
import bossImage3 from "../assets/boss-3.png";
import type { Habit, User } from "../types";

interface Quest {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface GamificationProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  completeHabitAndUpdateState: (id: number, date: string) => Promise<void>;
}

const bossStages = [
  {
    levelThreshold: 10,
    name: "Procrastinação",
    image: bossImage1,
    reward: { xp: 250, message: "A primeira sombra foi vencida!" },
  },
  {
    levelThreshold: 20,
    name: "Preguiça",
    image: bossImage2,
    reward: { xp: 500, message: "Sua força de vontade é inabalável!" },
  },
  {
    levelThreshold: Infinity,
    name: "Distração",
    image: bossImage3,
    reward: { xp: 1000, message: "O foco é sua maior arma!" },
  },
];

export const useGamification = ({
  habits,
  setHabits,
  user,
  setUser,
  completeHabitAndUpdateState,
}: GamificationProps) => {
  // Estados de feedback de UI que o hook gerencia
  const [mascotIsJumping, setMascotIsJumping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [justCompletedHabitId, setJustCompletedHabitId] = useState<
    string | number | null
  >(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Função para exibir a notificação de conquista
  const showAchievementToast = (achievement: Achievement) => {
    playSound("achievement.mp3");
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } flex items-center w-full max-w-xs p-4 space-x-4 text-slate-300 bg-brand-slate rounded-lg shadow-lg border border-brand-light-slate`}
        >
          <achievement.icon className="w-8 h-8 text-brand-cyan" />
          <div className="flex-1">
            <p className="font-bold text-brand-purple">
              Conquista Desbloqueada!
            </p>
            <p className="text-sm">{achievement.name}</p>
          </div>
          <button onClick={() => toast.dismiss(t.id)}>✕</button>
        </div>
      ),
      { duration: 4000 }
    );
  };

  // Função para desbloquear uma conquista
  const unlockAchievement = async (achievementId: number) => {
    if (user.unlockedAchievementIds.includes(achievementId)) return;

    const achievement = achievementsData.find(
      (ach) => ach.id === achievementId
    );
    if (!achievement) return;

    // Optimistic UI update
    const originalAchievements = user.unlockedAchievementIds;
    setUser((u) => {
      if (!u) return null;
      return {
        ...u,
        unlockedAchievementIds: [...u.unlockedAchievementIds, achievementId],
      };
    });
    setTimeout(() => showAchievementToast(achievement), 500);

    // API call to persist the change
    try {
      const token = localStorage.getItem("authToken");
      await fetch("http://localhost:5000/api/achievements/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ achievementId }),
      });
    } catch (error) {
      console.error("Failed to save achievement:", error);
      toast.error("Falha ao salvar a conquista.");
      // Revert UI on failure
      setUser((u) => {
        if (!u) return null;
        return { ...u, unlockedAchievementIds: originalAchievements };
      });
    }
  };

  // --- Lógica da Batalha de Chefe ---
  const BOSS_MAX_HP = 100;
  const [boss, setBoss] = useState(() => {
    const savedBoss = localStorage.getItem("bossState");
    return savedBoss
      ? JSON.parse(savedBoss)
      : { name: "Procrastinação", hp: BOSS_MAX_HP, image: bossImage1 };
  });
  const [isBossTakingDamage, setIsBossTakingDamage] = useState(false);
  const [isBossDefeated, setIsBossDefeated] = useState(false);

  // Persiste o estado do chefe
  useEffect(() => {
    localStorage.setItem("bossState", JSON.stringify(boss));
  }, [boss]);

  // --- Lógica do Baú de Recompensas ---
  const [chestProgress, setChestProgress] = useState(() => {
    return parseInt(localStorage.getItem("chestProgress") || "0", 10);
  });

  useEffect(() => {
    localStorage.setItem("chestProgress", String(chestProgress));
  }, [chestProgress]);

  // Estados internos de gamificação
  const [completionStreak, setCompletionStreak] = useState(0);
  const [lastCompletedHabitIds, setLastCompletedHabitIds] = useState<number[]>(
    []
  );
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);

  // Efeito para reiniciar as missões diárias
  useEffect(() => {
    const fetchDailyQuests = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return; // Não busca se não houver token
      }
      try {
        const response = await fetch("http://localhost:5000/api/quests/daily", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Falha ao buscar missões diárias");
        }
        const data = await response.json();
        setDailyQuests(data);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar as missões diárias.");
      }
    };

    fetchDailyQuests();
    // A dependência vazia [] garante que este efeito rode apenas uma vez na montagem do componente.
  }, []);

  // Efeito para atualizar o chefe com base no nível do usuário
  useEffect(() => {
    if (!user) return;

    const currentBossData = bossStages.find(
      (stage) => user.level <= stage.levelThreshold
    )!;

    // Atualiza o chefe (nome e imagem) se o estágio mudou
    if (boss.name !== currentBossData.name)
      setBoss({
        name: currentBossData.name,
        hp: BOSS_MAX_HP,
        image: currentBossData.image,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.level]);

  // Efeito para verificar conquistas baseadas em estado
  useEffect(() => {
    if (!user || habits === undefined) return;

    // Pioneiro: Crie seu primeiro hábito.
    if (habits.length >= 1) unlockAchievement(1);

    // Aprendiz: Alcance o nível 5.
    if (user.level >= 5) unlockAchievement(3);

    // Colecionador: Tenha 5 hábitos ativos ao mesmo tempo.
    if (habits.length >= 5) unlockAchievement(5);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.level, habits.length]);

  const playSound = (soundFile: string) => {
    const audio = new Audio(`/sounds/${soundFile}`);
    audio.play().catch((error) => console.error("Erro ao tocar o som:", error));
  };

  const handleBossDefeated = () => {
    setIsBossDefeated(true);
    playSound("achievement.mp3");

    // Conquista específica do chefe
    if (boss.name === "Procrastinação") unlockAchievement(4);

    // Após a animação, dá a recompensa e o useEffect cuidará do próximo chefe
    setTimeout(() => {
      const defeatedBoss = bossStages.find((b) => b.name === boss.name);
      if (defeatedBoss) {
        const { xp, message } = defeatedBoss.reward;
        setUser((u) => {
          if (!u) return null;
          return { ...u, xp: u.xp + xp };
        });
        toast.success(`🔥 ${boss.name} derrotado! +${xp} XP! ${message} 🔥`, {
          duration: 6000,
          icon: "🏆",
        });
      }
      setIsBossDefeated(false); // Reseta o estado da animação
    }, 1500); // Duração da animação de derrota
  };

  const triggerCompletionFeedback = (id: number | string) => {
    setMascotIsJumping(true);
    setShowConfetti(true);
    // Usamos um ID único para o brilho, pode ser string ou número
    setJustCompletedHabitId(String(id));
    playSound("complete.mp3");
    setTimeout(() => setMascotIsJumping(false), 1200);
    setTimeout(() => setJustCompletedHabitId(null), 2000);
  };

  const handleHabitCompletion = async (id: number, date: string) => {
    // Armazena o estado do hábito ANTES da atualização para comparar depois
    const habitBeforeUpdate = habits.find((h) => h.id === id);

    // --- Lógica da Batalha de Chefe ---
    const damage = 10; // Cada hábito causa 10 de dano
    const newHp = Math.max(0, boss.hp - damage);
    setIsBossTakingDamage(true);
    setTimeout(() => setIsBossTakingDamage(false), 300);

    if (newHp === 0) {
      handleBossDefeated();
    } else {
      setBoss({ ...boss, hp: newHp });
    }

    // 1.5. Lógica do Baú
    const newChestProgress = chestProgress + 1;
    if (newChestProgress <= 5) {
      // 5 é a meta para o baú
      setChestProgress(newChestProgress);
    }

    // Chama a função do context que já atualiza o estado e a API
    await completeHabitAndUpdateState(id, date);
    const updatedHabit = habits.find((h) => h.id === id);
    // 4. Lógica de Combo
    if (!lastCompletedHabitIds.includes(id)) {
      const newStreak = completionStreak + 1;
      setCompletionStreak(newStreak);
      setLastCompletedHabitIds([...lastCompletedHabitIds, id]);

      if (newStreak === 3) {
        toast.success("🔥 Combo de 3 missões! +20 XP Bônus!", { icon: "🔥" });
        playSound("combo.mp3");
        setCompletionStreak(0);
        setLastCompletedHabitIds([]);
      }
    }

    // 5. Lógica de Conquistas
    if (
      habitBeforeUpdate &&
      updatedHabit &&
      updatedHabit.completedCount > habitBeforeUpdate.completedCount &&
      updatedHabit.completedCount === 1
    ) {
      // Iniciado: Complete um hábito pela primeira vez.
      unlockAchievement(2);
    }
  };

  const completeDailyQuest = (questId: number) => {
    const quest = dailyQuests.find((q) => q.id === questId);
    if (!quest || quest.completed) return;

    // Otimistic UI Update
    const updatedQuests = dailyQuests.map((q) =>
      q.id === questId ? { ...q, completed: true } : q
    );
    setDailyQuests(updatedQuests);
    triggerCompletionFeedback(`daily-${questId}`); // Feedback visual

    // --- Lógica da Batalha de Chefe ---
    const damage = 15; // Missões diárias causam mais dano
    const newHp = Math.max(0, boss.hp - damage);
    setIsBossTakingDamage(true);
    setTimeout(() => setIsBossTakingDamage(false), 300);

    if (newHp === 0) {
      handleBossDefeated();
    } else {
      setBoss({ ...boss, hp: newHp });
    }

    // Chamada à API
    const completeQuestOnBackend = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          `http://localhost:5000/api/quests/daily/${questId}/complete`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { user: updatedUser } = await response.json();

        // Sincroniza o estado do usuário com a resposta do backend
        setUser(updatedUser);

        // Verifica se houve level up
        if (updatedUser.level > user.level) {
          setShowLevelUp(true);
          playSound("level-up.mp3");
          setTimeout(() => setShowLevelUp(false), 4000);
        }
      } catch (error) {
        console.error("Erro ao completar missão:", error);
        toast.error("Falha ao salvar progresso da missão.");
        // Reverte a UI em caso de erro
        setDailyQuests(dailyQuests);
      }
    };

    completeQuestOnBackend();
  };

  const openChest = () => {
    // Lógica para dar uma recompensa aleatória
    const rewardAmount = Math.floor(Math.random() * 101) + 50; // Entre 50 e 150 XP
    const reward = { type: "XP", amount: rewardAmount };

    playSound("achievement.mp3");
    toast.success(`Você ganhou ${rewardAmount} XP do baú!`, { icon: "💎" });

    setUser((u) => {
      if (!u) return null;
      return {
        ...u,
        xp: u.xp + rewardAmount,
        totalXp: u.totalXp + rewardAmount,
      };
    });
    setChestProgress(0); // Reinicia o progresso

    return reward;
  };

  return {
    mascotIsJumping,
    showConfetti,
    setShowConfetti,
    justCompletedHabitId,
    showLevelUp,
    completeHabit: handleHabitCompletion, // Renomeado para evitar confusão
    dailyQuests,
    completeDailyQuest,
    chestProgress,
    CHEST_GOAL: 5,
    openChest,
    boss,
    BOSS_MAX_HP,
    isBossTakingDamage,
    isBossDefeated,
  };
};
