import express from "express";
import * as publisherController from "../controllers/publisherController";

const router = express.Router();

router.post("/", publisherController.createPublisher);
router.get("/", publisherController.getAllPublishers);
router.get("/:id", publisherController.getPublisherById);
router.delete("/:id", publisherController.deletePublisher);
router.get("/:id/books", publisherController.getBooksByPublisher);

export default router;
