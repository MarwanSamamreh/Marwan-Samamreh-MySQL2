import { Request, Response } from "express";
import CommentModel from "../models/comments";
import { Comment } from "../types";
import BookModel from "../models/books";
import { commentSchema } from "../utils/validate";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { error } = commentSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }

    const { name, comment, stars, BookId } = req.body as Comment;

    const book = await BookModel.findByPk(BookId);
    if (!book) {
      return res.status(400).json({ error: "Book not found" });
    }

    const newComment = await CommentModel.create({
      name,
      comment,
      stars,
      BookId,
    });
    res.json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = Number(req.params.id);

    const deletedRow = await CommentModel.destroy({
      where: { id: commentId },
    });

    if (deletedRow > 0) {
      res.json({ message: "Comment deleted successfully" });
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
