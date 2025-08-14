import { setTodos, updateTodo, deleteTodo, allTodos } from "../controllers/todo.js";
import express from "express";
import { isAuthenticated } from "../middleware/authenticate.js";

export const todoRoute = express.Router();

todoRoute.post("/setTodo",isAuthenticated ,setTodos);
todoRoute.get("/allTodos", isAuthenticated, allTodos);    
todoRoute.put("/update/:id", isAuthenticated , updateTodo);
todoRoute.delete("/delete/:id", isAuthenticated , deleteTodo);