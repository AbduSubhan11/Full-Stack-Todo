import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
