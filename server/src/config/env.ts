import { configDotenv } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  configDotenv();
}

export default {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT ?? "3000",
  host: process.env.HOST,
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  secondaryClientUrl: process.env.SECONDARY_CLIENT_URL,
  flyMachineId: process.env.FLY_MACHINE_ID,
};
