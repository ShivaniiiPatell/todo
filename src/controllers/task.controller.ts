import { Request, Response } from "express";
import Todo, { ITodo } from "../models/Todo";
import { AuthRequest } from "../middlewares/auth";
import { successResponse, errorResponse } from "../utils/response";
import mongoose from "mongoose";

export const getTodos = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { date } = req.query;

    if (!date) {
      errorResponse(res, "Date is required in YYYY-MM-DD", 400);
    }

    const parsedDate = new Date(date as string);

    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const todos = await Todo.find({
      dueDate: { $gte: startOfDay, $lte: endOfDay },
    });

    successResponse(res, "Todos retrieved successfully", { todos });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    errorResponse(res, errorMessage, 500);
  }
};

export const createTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const todo = await Todo.create({
      user: req.user?.id,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
    });
    successResponse(res, "Todo created successfully", todo, 201);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    errorResponse(res, errorMessage, 500);
  }
};

export const deleteTodos = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const objectId: any = new mongoose.Types.ObjectId(req.params?.id);
    const todos = await Todo.findByIdAndDelete({ _id: objectId });
    successResponse(res, "Todos deleted successfully", null);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    errorResponse(res, errorMessage, 500);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const objectId: any = new mongoose.Types.ObjectId(id);

    const { title, description, dueDate } = req.body;

    const todo = await Todo.findById(objectId);
    if (!todo) {
      errorResponse(res, "Todo not found", 404);
    } else {
      const today = new Date();
      const todoDueDate = new Date(todo?.dueDate);

      today.setHours(0, 0, 0, 0);
      todoDueDate.setHours(0, 0, 0, 0);

      if (today.getTime() !== todoDueDate.getTime()) {
        errorResponse(
          res,
          "You can only edit Todo tasks with today's due date",
          400
        );
      }

      if (!title && !description && !dueDate) {
        errorResponse(
          res,
          "At least one field (title, description, or due date) must be provided.",
          400
        );
      }

      const updatedTodo = await Todo.findByIdAndUpdate(
        objectId,
        { title, description, dueDate },
        { new: true, runValidators: true }
      );

      successResponse(res, "Todo updated successfully", updatedTodo);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    errorResponse(res, errorMessage, 500);
  }
};

export const markTodoAsCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const objectId: any = new mongoose.Types.ObjectId(id);

    const todo = await Todo.findById(objectId);
    if (!todo) {
      errorResponse(res, "Todo not found", 404);
    } else {
      if (todo.status === "completed") {
        errorResponse(res, "Todo is already marked as completed", 400);
      }

      todo.status = "completed";
      await todo.save();

      successResponse(res, "Todo marked as completed", todo);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    errorResponse(res, errorMessage, 500);
  }
};

export const unmarkTodoAsCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const objectId: any = new mongoose.Types.ObjectId(id);

    const todo = await Todo.findById(objectId);
    if (!todo) {
      errorResponse(res, "Todo not found", 404);
    } else {
      if (todo.status === "pending") {
        errorResponse(res, "Todo is already marked as pending", 400);
      }

      todo.status = "pending";
      await todo.save();

      successResponse(res, "Todo marked as pending", todo);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    errorResponse(res, errorMessage, 500);
  }
};
