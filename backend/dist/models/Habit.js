import { DataTypes, Model, } from "sequelize";
import sequelize from "../db.js";
class Habit extends Model {
}
Habit.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    completedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize,
    modelName: "Habit",
});
export default Habit;
