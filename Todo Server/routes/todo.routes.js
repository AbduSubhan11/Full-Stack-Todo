import { setTodos, updateTodo, deleteTodo, allTodos } from "../controllers/todo";
import express from "express";
import { isAuthenticated } from "../middleware/authenticate";

const todoRoute = express.Router();

todoRoute.post("/setTodo",isAuthenticated ,setTodos);
todoRoute.get("/allTodos", allTodos);    
todoRoute.put("/update/:id", isAuthenticated , updateTodo);
todoRoute.delete("/delete/:id", isAuthenticated , deleteTodo);