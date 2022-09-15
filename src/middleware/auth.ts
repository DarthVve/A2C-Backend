import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';
import { UserInstance } from "../model/userModel";
// import { userReq } from "../types/express";

const secret = process.env.JWT_SECRET as string;

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization && !req.cookies.token) {
      return res.status(401).json({ message: "Authentication required. Please login" })
    }

    const token = authorization?.slice(7) || req.cookies.token as string;
    let verified = verify(token, secret);
    if (!verified) {
      return res.status(401).json({ message: "Token expired/invalid. Please login" });
    }

    const { id } = verified as { [key: string]: string };
    const user = await UserInstance.findOne({ where: { id } });
    if (!user) {
      return res.status(401).json({ message: "User could not be identified" });
    }
    req.user = id;
    next()
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Unexpected Auth error" });
  }
}
