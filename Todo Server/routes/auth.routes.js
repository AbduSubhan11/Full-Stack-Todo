import express from "express";
import { login, logout, register } from "../controllers/auth";

const authrouter = express.Router();

authrouter.post("/login", login);
authrouter.post("/resgister", register);
authrouter.post("/logout", logout);
authrouter.post("/getuser/:userId", logout);
