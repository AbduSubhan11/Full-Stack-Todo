import dotenv from "dotenv";
import express from "express";
import authrouter from "./routes/auth.routes";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(cookieParser());

app.use("/api/v1", authrouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Todo App API");
});
