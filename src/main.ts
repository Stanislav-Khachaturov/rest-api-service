import { NestFactory } from "@nestjs/core";
import { NestFastifyApplication, FastifyAdapter } from "@nestjs/platform-fastify";
import fastifyCsrf from "@fastify/csrf-protection";
import helmet from "@fastify/helmet";
import { ValidationPipe, VersioningType, Logger as NestLogger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Logger } from "nestjs-pino";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ResponseInterceptor } from "./core/response.interceptor";
import { HttpExceptionFilter } from "./core/exception.filters";
import { AppModule } from "./core/app.module";
import { EnvironmentVariables } from "./core/config.module";

const logger = new NestLogger("NestApplication");

process.on("unhandledRejection", error => logger.error("Unhandled Rejection", error));

process.on("uncaughtException", error => logger.error("Uncaught Exception", error));

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ requestIdHeader: "request_id" }),
    { bufferLogs: true },
  );

  app.useLogger(app.get(Logger));
  const config = app.get(ConfigService<EnvironmentVariables, true>);
  const port = config.get<number>("egf_port");
  const env = config.get<string>("egf_environment");

  app.setGlobalPrefix("api/v1/profile", {
    exclude: ["healthcheck(.*)"],
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.register(helmet, {
    contentSecurityPolicy: env === "prod",
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.register(fastifyCsrf);

  if (env !== "prod") {
    const version = config.get<string>("npm_package_version");
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Profile")
      .setDescription("Profile API")
      .setVersion(version)
      .addGlobalParameters(
        {
          name: "REQUEST_SOURCE",
          example: "PatientPortal",
          in: "header",
          required: true,
        },
        {
          name: "REQUEST_TOPIC",
          example: "TestResultNotification",
          in: "header",
          required: true,
        },
      )
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup("api_doc", app, document);
  }

  await app.listen(port, "0.0.0.0");
}

bootstrap();
