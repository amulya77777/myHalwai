import { Request, Response, NextFunction } from "express";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (process.env.NODE_ENV !== "production") console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
}
