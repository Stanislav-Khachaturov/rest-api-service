import { plainToInstance } from "class-transformer";
import { ConfigModule } from "@nestjs/config";
import { IsNotEmpty, IsEnum, IsNumber, validateSync, IsUrl, IsOptional } from "class-validator";

enum Envs {
  local = "local",
  dev = "dev",
  stage = "stage",
  prod = "prod",
}

export class EnvironmentVariables {
  // @IsUrl({ protocols: ["postgresql"], require_tld: false })
  egf_databaseUrl: string;

  // @IsEnum(Envs)
  @IsNotEmpty()
  egf_environment: string;

  @IsNumber()
  @IsOptional()
  egf_port: number = 3000;

  @IsOptional()
  egf_logLevel = "info";

  @IsNotEmpty()
  npm_package_version: string;
}

function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return validatedConfig;
}

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  validate,
});

export { configModule as ConfigModule };
