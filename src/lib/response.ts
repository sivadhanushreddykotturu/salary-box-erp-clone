import { NextResponse } from 'next/server';
import { AppError } from './errors';
import { ZodError } from 'zod';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  errors?: any;
}

export function jsonResponse<T>(
  data: T,
  statusCode = 200,
  message?: string,
  meta?: ApiResponse['meta']
) {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
  };
  return NextResponse.json(body, { status: statusCode });
}

export function errorResponse(error: unknown) {
  console.error('[API_ERROR]', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  const message = error instanceof Error ? error.message : 'Internal Server Error';
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 500 }
  );
}