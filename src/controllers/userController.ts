import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/users";
import SessionModel from "../models/session";
import { v4 as uuidv4 } from "uuid";
import session from "express-session";
import { Session, User } from "../types";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username is already taken
    const usernameExists = await UserModel.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = (await UserModel.create({
      username,
      password: hashedPassword,
      email,
    })) as unknown as User;

    const sessionId = uuidv4();

    const sessionData = {
      sid: sessionId,
      userId: newUser.id,
    } as unknown as Session;

    const result = await SessionModel.create(sessionData);
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error2" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = (await UserModel.findOne({
      where: { username },
    })) as User | null;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    const sessionId = uuidv4();

    const sessionData = {
      sid: sessionId,
      userId: user.id,
    } as unknown as Session;

    const result = await SessionModel.create(sessionData);

    // Set the session ID in the response cookie
    res.setHeader("Authorization", sessionId);

    res.json({ message: "Sign in successful", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    // Extract session ID from the Authorization header
    const sessionId = req.headers.authorization;

    if (!sessionId) {
      return res.status(401).json({ error: "Session ID not provided" });
    }

    const session = (await SessionModel.findOne({
      where: { sid: sessionId },
    })) as unknown as Session;

    if (!session) {
      return res.status(404).json({ error: "Session ID not found" });
    }

    const userId = session.userId;
    // Delete the associated session
    const deletedCount = await SessionModel.destroy({
      where: { userId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Session ID not found" });
    }

    res.json({ message: "Sign out successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
