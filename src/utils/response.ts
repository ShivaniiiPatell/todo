import { Response } from "express";

/**
 * Utility to send a success response.
 * @param res Express Response object.
 * @param message Success message.
 * @param data Optional payload data.
 * @param statusCode HTTP status code (default: 200).
 */
export const successResponse = (
  res: Response,
  message: string,
  data: Record<string, any> | null = null,
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Utility to send an error response.
 * @param res Express Response object.
 * @param message Error message.
 * @param statusCode HTTP status code (default: 500).
 * @param errors Optional additional error details.
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors: Record<string, any> | null = null
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
