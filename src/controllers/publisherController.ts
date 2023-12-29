import { Request, Response } from "express";
import PublisherModel from "../models/publishers";
import { Publisher } from "../types";
import BookModel from "../models/books";
import { publisherSchema } from "../utils/validate";

export const createPublisher = async (req: Request, res: Response) => {
  try {
    const { error } = publisherSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }
    const { name, country } = req.body as Publisher;

    const newPublisher = await PublisherModel.create({ name, country });
    res.json(newPublisher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPublishers = async (req: Request, res: Response) => {
  try {
    const publishers = await PublisherModel.findAll();

    res.json(publishers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPublisherById = async (req: Request, res: Response) => {
  try {
    const publisherId = Number(req.params.id);
    const publisherResult = await PublisherModel.findByPk(publisherId);
    if (publisherResult) res.json(publisherResult);
    else res.json({ error: "publisher was not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePublisher = async (req: Request, res: Response) => {
  try {
    const publisherId = Number(req.params.id);

    const publisherHasBooks = await BookModel.findOne({
      where: { PublisherId: publisherId },
    });

    if (publisherHasBooks) {
      return res
        .status(400)
        .json({ error: "Publisher has books and cannot be deleted." });
    }

    const deletedRow = await PublisherModel.destroy({
      where: { id: publisherId },
    });

    if (deletedRow > 0) {
      res.json({ message: "Publisher Deleted Successfully!" });
    } else {
      res.status(404).json({ error: "Publisher Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal Server Error" });
  }
};

export const getBooksByPublisher = async (req: Request, res: Response) => {
  try {
    const publisherId = Number(req.params.id);
    const publisherResult = (await PublisherModel.findByPk(publisherId, {
      include: [{ model: BookModel }],
    })) as unknown as Publisher;
    if (publisherResult) {
      // Check if the publisher has books
      if (publisherResult.Books && publisherResult.Books.length > 0) {
        res.json(publisherResult);
      } else {
        res.status(404).json({ error: "Publisher has no books" });
      }
    } else {
      res.status(404).json({ error: "No publisher found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
