import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerOptions } from "typeorm";
import { TypeOrmModuleOptions, TypeOrmModule } from "@nestjs/typeorm";

const databaseModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => {
    return {
      type: "postgres",
      url: config.get("egf_databaseUrl"),
      autoLoadEntities: true,
      logging: config.get("egf_logSql"),
    };
  },
});

export { databaseModule as DatabaseModule };
