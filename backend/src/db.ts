import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "dev.sqlite",
  logging: false,
});

export default sequelize;
