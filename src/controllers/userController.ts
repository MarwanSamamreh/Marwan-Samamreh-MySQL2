import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/users";
import SessionModel from "../models/session";
import { v4 as uuidv4 } from "uuid";
import { Session, User } from "../types";
import {
  signupSchema,
  signinSchema,
  changepassSchema,
} from "../utils/validate";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { error } = signupSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }

    const { username, email, password } = req.body;

    const usernameExists = await UserModel.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    res.json({ newUser, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error2" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { error } = signinSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }
    const { username, password } = req.body;

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

    res.json({ message: "Sign in successful", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    const sessionId = req.headers.authorization;

    const session = (await SessionModel.findOne({
      where: { sid: sessionId },
    })) as unknown as Session;

    if (!session) {
      return res.status(404).json({ error: "Session ID not found" });
    }

    const userId = session.userId;
    const deletedSessions = await SessionModel.destroy({
      where: { userId },
    });

    if (deletedSessions === 0) {
      return res.status(404).json({ error: "Session ID not found" });
    }

    res.json({ message: "Sign out successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const sessionId = req.headers.authorization;

    const session = (await SessionModel.findOne({
      where: { sid: sessionId },
    })) as unknown as Session;

    if (!session) {
      return res.status(404).json({ error: "Session ID not found" });
    }

    const userId = session.userId;
    const user = (await UserModel.findOne({
      where: { id: userId },
    })) as unknown as User;

    const { error } = changepassSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ error: "Invalid Current Password" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({ error: "Passwords don't match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [updatedRow] = await UserModel.update(
      {
        password: hashedPassword,
      },
      { where: { id: userId } }
    );

    if (updatedRow > 0) {
      await SessionModel.destroy({ where: { userId } });
      return res.status(200).json({ message: "Password updated successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
