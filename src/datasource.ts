import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";

config();
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env["egf_databaseUrl"],
  logging: false,
  synchronize: false,
  entities: [`./**/*.entity.ts`],
  migrations: ["./migrations/*.ts"],
  subscribers: [],
  extra: {
    poolSize: 20,
    connectionTimeoutMillis: 2000,
    query_timeout: 1000,
    statement_timeout: 1000
  }
});
