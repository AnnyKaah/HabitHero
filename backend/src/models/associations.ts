import User from "./User.js";
import Habit from "./Habit.js";
import Skill from "./Skill.js";
import DailyQuest from "./DailyQuest.js";
import HabitLog from "./HabitLog.js";
import DailyQuestCompletion from "./DailyQuestCompletion.js";

// Um usuário tem muitos hábitos
User.hasMany(Habit, {
  foreignKey: {
    name: "userId",
    allowNull: false, // Garante que a chave estrangeira não pode ser nula
  },
  onDelete: "CASCADE",
});
Habit.belongsTo(User, { foreignKey: "userId" });

// Um hábito tem muitos registros (logs)
Habit.hasMany(HabitLog, {
  as: "logs",
  foreignKey: "habitId",
  onDelete: "CASCADE",
});
HabitLog.belongsTo(Habit, { foreignKey: "habitId" });

// Um usuário pode ter muitas habilidades, e uma habilidade pode pertencer a muitos usuários
// O Sequelize criará automaticamente a tabela de junção 'UserSkills'
User.belongsToMany(Skill, { through: "UserSkills" });
Skill.belongsToMany(User, { through: "UserSkills" });

// User e DailyQuestCompletion
User.hasMany(DailyQuestCompletion, { foreignKey: "userId" });
DailyQuestCompletion.belongsTo(User, { foreignKey: "userId" });

// DailyQuest e DailyQuestCompletion
DailyQuest.hasMany(DailyQuestCompletion, { foreignKey: "questId" });
DailyQuestCompletion.belongsTo(DailyQuest, { foreignKey: "questId" });
