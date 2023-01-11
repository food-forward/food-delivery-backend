import { Request, NextFunction, Response } from "express";
import { validateJWTToken } from "@/utils/auth-utils";
import { AuthPayload } from "@/dto";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.get("Authorization");
  if (!authToken) return res.status(400).json({ message: "Invalid token" });

  const token = authToken.split(" ")[1] as string;

  const payload = await validateJWTToken(token);
  if (!payload) {
    return res.status(400).json({ message: "User Not authorised" });
  }

  req.user = payload;

  return next();
};
