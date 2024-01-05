import { Request, Response } from "express";
import { Book, Session } from "../types";
import BookModel from "../models/books";
import PublisherModel from "../models/publishers";
import CommentModel from "../models/comments";
import SessionModel from "../models/session";
import sequelize from "../config/database";
import { Op } from "sequelize";
import { bookSchema } from "../utils/validate";

export const createBook = async (req: Request, res: Response) => {
  try {
    const { error } = bookSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }

    const { title, isbn, PublisherId, year, author, pages } = req.body as Book;

    const isbnExist = await BookModel.findOne({ where: { isbn } });

    if (isbnExist) {
      return res.status(400).json({ error: "ISBN should be unique" });
    }

    const publisher = await PublisherModel.findByPk(PublisherId);

    if (!publisher) {
      return res.status(400).json({ error: "Publisher not found" });
    }

    const sessionId = req.headers.authorization;
    const session = (await SessionModel.findOne({
      where: { sid: sessionId },
    })) as unknown as Session;

    const userId = session.userId;

    const newBook = await BookModel.create({
      title,
      isbn,
      PublisherId,
      year,
      author,
      pages,
      userId,
    });

    //const bookData = newBook.get() as Book;
    res.json(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const bookId = Number(req.params.id);

    // Fetch book along with publisher and comments
    const bookResult = (await BookModel.findByPk(bookId, {
      include: [
        {
          model: PublisherModel,
        },
        {
          model: CommentModel,
        },
      ],
    })) as Book | null;

    if (bookResult) {
      res.json(bookResult);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await BookModel.findAll();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;

    const { title, isbn, year, author, pages, PublisherId } = req.body as Book;

    const [updatedRow] = await BookModel.update(
      { title, isbn, year, author, pages, PublisherId },
      { where: { id: bookId } }
    );

    if (updatedRow > 0) {
      res.json({ message: "Book updated successfully" });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const bookId = Number(req.params.id);

    const deletedRow = await BookModel.destroy({ where: { id: bookId } });

    if (deletedRow > 0) {
      res.json({ message: "Book deleted successfully" });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTopRatedBooks = async (req: Request, res: Response) => {
  try {
    const topRatedBooks = await BookModel.findAll({
      attributes: [
        "id",
        "title",
        [
          sequelize.literal(
            "(SELECT AVG(stars) FROM Comments WHERE Book.id = Comments.BookId)"
          ),
          "rating",
        ],
      ],
      include: [
        {
          model: CommentModel,
          attributes: [],
          where: {
            stars: { [Op.ne]: null },
          },
        },
      ],
      order: [[sequelize.literal("rating"), "DESC"]],
      limit: 15,
    });

    res.status(200).json(topRatedBooks);
  } catch (error) {
    console.error("Error getting top-rated books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const books = await BookModel.findAll({
      where: {
        title: {
          [Op.like]: `%${query}%`,
        },
      },
    });

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
