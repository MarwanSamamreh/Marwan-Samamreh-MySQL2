import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Publisher = sequelize.define(
  "Publisher",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Publisher;
