import { Module } from "@nestjs/common";
import { ConfigModule } from "./config.module";
import { LoggerModule } from "./logger.module";
import { DatabaseModule } from "./database.module";
import { HealthModule } from "../health/health.module";
import { UserModule } from "../user/user.module";
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    DatabaseModule,
    HealthModule,
    UserModule,
    CacheModule.register({
      isGlobal: true,
      store: typeof redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: []
})
export class AppModule {}
