import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { stdTimeFunctions, levels, LogFn } from "pino";
import { LoggerModule as Logger } from "nestjs-pino";

@Module({
  imports: [
    Logger.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const hooks = {
          logMethod(inputArgs: any, method: LogFn, level: number) {
            const [{ context = "NestRequest", err, responseTime }, msg, meta] = inputArgs;
            const message = msg || err?.message || "Unknown Error";
            let extra = {};

            if (meta) {
              extra =
                levels.labels[level] === "error" && meta instanceof Error
                  ? { meta: { error: meta.message } }
                  : { meta };
            }

            return Reflect.apply(method, this, [{ context, responseTime, ...extra }, message]);
          },
        };
        const autoLogging: any = config.get("egf_logRequests")
          ? { ignore: (req: any) => req.originalUrl.includes("/healthcheck") }
          : false;

        return {
          pinoHttp: {
            hooks,
            messageKey: "message",
            useLevel: config.get("egf_logLevel"),
            formatters: {
              bindings: () => ({}),
              level: level => ({ level }),
            },
            customAttributeKeys: {
              req: "request",
              res: "response",
              err: "error",
            },
            serializers: {
              req: req => {
                return {
                  id: req.id,
                  method: req.method,
                  url: req.url,
                  source: req.headers["request_source"],
                  topic: req.headers["request_topic"],
                };
              },
            },
            timestamp: stdTimeFunctions.isoTime,
            autoLogging,
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
