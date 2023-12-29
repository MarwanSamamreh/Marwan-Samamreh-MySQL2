import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import Publisher from "./publishers";

const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING(13),
      allowNull: false,
      unique: true,
    },
    year: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    author: {
      type: DataTypes.STRING(255),
    },
    pages: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
  },
  {
    timestamps: false,
  }
);

Publisher.hasMany(Book);
Book.belongsTo(Publisher);

export default Book;
