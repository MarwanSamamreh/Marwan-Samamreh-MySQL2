// src/config/database.ts
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "@MarwanSam92",
  database: "projectbooks",
});

export default sequelize;
