import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../db.js";

// Tipos de condição para desbloquear uma conquista
export enum AchievementType {
  COMPLETED_COUNT = "COMPLETED_COUNT", // Ex: Complete um hábito 10 vezes
  LEVEL_REACHED = "LEVEL_REACHED", // Ex: Alcance o nível 5 em um hábito
  HABITS_CREATED = "HABITS_CREATED", // Ex: Crie 5 hábitos diferentes
}

class Achievement extends Model<
  InferAttributes<Achievement>,
  InferCreationAttributes<Achievement>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare icon: string; // Nome do ícone (ex: 'Award', 'Star' da lucide-react)
  declare type: AchievementType;
  declare value: number; // O valor a ser alcançado (ex: 10, 5)
}

Achievement.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: false, defaultValue: "Award" },
    type: {
      type: DataTypes.ENUM(...Object.values(AchievementType)),
      allowNull: false,
    },
    value: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Achievement" }
);

// Você precisaria popular a tabela 'Achievements' com dados iniciais (seed).
// Ex: { name: 'Novato', description: 'Complete sua primeira missão', type: 'COMPLETED_COUNT', value: 1 }

export default Achievement;
