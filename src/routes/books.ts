import express from "express";
import * as bookController from "../controllers/bookController";

const router = express.Router();

router.post("/", bookController.createBook);
router.get("/", bookController.getAllBooks);
router.get("/search", bookController.searchBooks);
router.get("/top-rated", bookController.getTopRatedBooks);
router.get("/:id", bookController.getBookById);
router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

export default router;
