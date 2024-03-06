import { Logger, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from "@nestjs/common";
import { map, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface ResponseError {
  error: string;
  message: string;
}

export interface ResponseResult<T> {
  result: T;
}

export type Response<T> = ResponseError | ResponseResult<T>;

export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  private logger = new Logger("ResponseInterceptor");

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next
      .handle()
      .pipe(
        catchError(err => {
          const isDriverError = "driverError" in err;

          if (isDriverError && err.driverError.code === "23505") {
            return throwError(
              () => new HttpException({ error: "Duplicate", message: err.driverError.detail }, HttpStatus.CONFLICT),
            );
          }

          const statusCode = err.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
          const errorType = err.response?.error || "Internal Server Error";
          const respMessage = Array.isArray(err.response?.message) ? err.response?.message[0] : err.response?.message;
          const message = respMessage || err.message;

          this.logger.error(message);

          return throwError(() => new HttpException({ error: errorType, message }, statusCode));
        }),
      );
  }
}
