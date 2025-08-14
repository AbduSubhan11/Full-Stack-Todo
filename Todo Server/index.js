import dotenv from "dotenv";
import express from "express";
import {authrouter} from "./routes/auth.routes.js";
import {todoRoute} from "./routes/todo.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser"
import mongoose from "mongoose";
dotenv.config();

const app = express();


app.use(cors({ 
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authrouter);
app.use("/api/v2", todoRoute);


app.get("/", (req, res) => {
  res.send("Welcome to the Todo App API");
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT} ✅`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
  });