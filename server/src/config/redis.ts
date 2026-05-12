import { Redis, type RedisOptions } from "ioredis";
import env from "./env.js";

const redisOptions: RedisOptions = {
  connectTimeout: 10000,
  commandTimeout: 5000,
};

export const pubClient = env.redisUrl
  ? new Redis(env.redisUrl, { ...redisOptions, family: 6 })
  : new Redis(redisOptions);
export const subClient = pubClient.duplicate();
