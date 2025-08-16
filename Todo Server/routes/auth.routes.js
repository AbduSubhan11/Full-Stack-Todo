import express from "express";
import {
  editProfile,
  getUser,
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/auth.js";
import { isAuthenticated } from "../middleware/authenticate.js";
import {upload} from "../middleware/multer.js";

export const authrouter = express.Router();



authrouter.post("/login", login);
authrouter.post("/register", register);
authrouter.get("/verify-email/:token", verifyEmail);
authrouter.post("/logout/:userId", logout);
authrouter.get("/getuser/:userId", getUser);
authrouter.put("/edit-profile", isAuthenticated, upload.single("profilePicture"),editProfile);
