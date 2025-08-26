import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express'; // ✅ Fixed import
import { MyLoggerService } from './my-logger/my-logger.service';
import { PrismaClientValidationError } from '@prisma/client/runtime/library'; // ✅ Fixed import

type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR, // ✅ Fixed initial status
      timestamp: new Date().toISOString(),
      path: request.url,
      response: 'Internal server error', // ✅ Added default message
    };

    // Handle HttpException (NestJS built-in exceptions)
    if (exception instanceof HttpException) {
      myResponseObj.statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        myResponseObj.response = exceptionResponse;
      } else {
        myResponseObj.response = { ...exceptionResponse };
      }

      this.logger.error(
        `${request.method} ${request.url} - ${JSON.stringify(myResponseObj.response)}`,
      );
    }
    // Handle Prisma Validation Errors
    else if (exception instanceof PrismaClientValidationError) {
      myResponseObj.statusCode = HttpStatus.BAD_REQUEST;
      myResponseObj.response = {
        message: 'Invalid input data',
        error: 'Bad Request',
        details: exception.message.replace(/\n/g, ' '), // Clean up Prisma error format
      };

      this.logger.error(
        `${request.method} ${request.url} - Prisma Validation Error: ${exception.message}`,
      );
    }
    // Handle all other unknown errors
    else {
      // ✅ Already set proper defaults above, no need to reassign

      // Log the actual error for debugging, but don't expose it to client
      this.logger.error(
        `${request.method} ${request.url} - Unknown Error: ${JSON.stringify(exception)}`,
      );
    }

    // Send the response
    response.status(myResponseObj.statusCode).json(myResponseObj);

    this.logger.error(myResponseObj.response, AllExceptionsFilter.name);

    super.catch(exception, host);
  }
}
