import { Logger, ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger("HttpExceptionFilter");

  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    let result = exception.getResponse();

    // Remake only errors which not catched by response interceptor or headers guard
    if (typeof result === "object" && "statusCode" in result && "error" in result && "message" in result) {
      this.logger.error(result.message, { status });
      result = {
        error: result.error,
        message: result.message,
      };
    }

    res.status(status).send(result);
  }
}
