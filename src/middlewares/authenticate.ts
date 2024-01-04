import { Request, Response, NextFunction } from "express";
import SessionModel from "../models/session";
import { Session } from "inspector";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.headers.authorization;

    if (!sessionId) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Session ID not provided" });
    }

    const session = await SessionModel.findOne({
      where: { sid: sessionId },
    });

    if (session) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
