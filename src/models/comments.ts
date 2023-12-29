import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import Book from "./books";

const Comment = sequelize.define(
  "Comment",
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
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

Book.hasMany(Comment, {
  onDelete: "CASCADE",
});
Comment.belongsTo(Book);

export default Comment;
