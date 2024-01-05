import express from "express";
import * as userController from "../controllers/userController";
import { authenticate } from "../middlewares/authenticate";
const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.get("/signout", authenticate, userController.signOut);
router.put("/changePassword", authenticate, userController.changePassword);

export default router;
