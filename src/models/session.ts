import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./users";

const Session = sequelize.define(
  "Session",
  {
    sid: { type: DataTypes.STRING(36), primaryKey: true },
  },
  {
    timestamps: false,
  }
);

Session.belongsTo(User, { foreignKey: "userId" });

export default Session;
