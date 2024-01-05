import joi from "joi";

export const signupSchema = joi.object({
  username: joi.string().alphanum().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const signinSchema = joi.object({
  username: joi.string().alphanum().min(3).max(30).required(),
  password: joi.string().min(6).required(),
});

export const changepassSchema = joi.object({
  currentPassword: joi.string().min(6).required(),
  newPassword: joi.string().min(6).required(),
  confirmPassword: joi
    .string()
    .valid(joi.ref("newPassword"))
    .required()
    .strict(),
});

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
