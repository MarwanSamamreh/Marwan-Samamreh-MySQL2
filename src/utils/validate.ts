import joi from "joi";

export const bookSchema = joi.object({
  title: joi.string().min(3).max(50).required(),
  isbn: joi.string().length(13).required(),
  PublisherId: joi.number().min(1).required(),
  year: joi.number().optional(),
  author: joi.string().min(3).max(30).optional(),
  pages: joi.number().optional(),
});

export const publisherSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  country: joi.string().min(3).max(30).optional(),
});

export const commentSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  comment: joi.string().min(3).max(200).required(),
  stars: joi.number().integer().greater(0).less(6).optional(),
  BookId: joi.number().required(),
});
