import { Test, TestingModule } from "@nestjs/testing";
import { NestFastifyApplication, FastifyAdapter } from "@nestjs/platform-fastify";
import supertest from "supertest";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { AppModule } from "../src/core/app.module";
import { ResponseInterceptor } from "../src/core/response.interceptor";

describe("AppController (e2e)", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.useLogger(app.get(Logger));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(app.get(ResponseInterceptor));
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it("/healthcheck returns status 200", () => {
    return supertest(app.getHttpServer()).get("/healthcheck").expect(200);
  });
});
