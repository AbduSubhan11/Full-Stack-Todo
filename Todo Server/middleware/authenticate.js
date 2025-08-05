import { User } from "../models/user";
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = User.findById(decode.id).select("-password");
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
