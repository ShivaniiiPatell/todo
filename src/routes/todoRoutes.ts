import { Router } from "express";
import { createTodo, deleteTodos, getTodos, updateTodo, markTodoAsCompleted } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth";
const todoRouter = Router();

todoRouter.post("/todo", authMiddleware, createTodo);
todoRouter.get("/todo", authMiddleware, getTodos);
todoRouter.delete("/todo/:id", authMiddleware, deleteTodos);
todoRouter.patch("/todo/:id", authMiddleware, updateTodo);
todoRouter.patch('/mark/:id', authMiddleware, markTodoAsCompleted);
todoRouter.patch('/unmark/:id', authMiddleware, markTodoAsCompleted);

export default todoRouter;
