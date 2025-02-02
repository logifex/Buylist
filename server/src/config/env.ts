import dotenv from "dotenv";

dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT ?? 3000,
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  serverUrl: process.env.SERVER_URL,
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  secondaryClientUrl: process.env.SECONDARY_CLIENT_URL,
  flyMachineId: process.env.FLY_MACHINE_ID,
};
