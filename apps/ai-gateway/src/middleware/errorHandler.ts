import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void {
  console.error('Error:', error);

  if (error instanceof Error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  } else {
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unknown error occurred',
    });
  }
}
