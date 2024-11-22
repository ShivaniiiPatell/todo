import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { successResponse, errorResponse } from "../utils/response";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password,email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      errorResponse(res, "Username already exists", 400);
    }

    const user = await User.create({ username, password,email });

    successResponse(res, "User registered successfully", user, 201);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    errorResponse(res, errorMessage, 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body)
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      errorResponse(res, "Invalid credentials", 400);
    }

    const isPasswordValid = await user?.comparePassword(password);
    if (!isPasswordValid) {
      errorResponse(res, "Invalid credentials", 400);
    }

    const token = jwt.sign(
      { id: user?._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    successResponse(res, "Login successful", { token });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    errorResponse(res, errorMessage, 500);
  }
};
