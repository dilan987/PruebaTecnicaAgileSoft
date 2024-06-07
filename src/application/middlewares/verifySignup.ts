import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies["token"] 
  if (!token) return res.status(403).json("No JWT provided");
    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        next();
    } catch (error: any) {
      new Error(error);
      return res.status(403).json("The user does not have an active session or their token is invalid");
    }

}