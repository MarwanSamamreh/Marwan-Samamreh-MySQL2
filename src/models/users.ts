import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    username: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(255), allowNull: false },
    password: { type: DataTypes.STRING(60), allowNull: false },
  },
  { timestamps: false }
);

export default User;
