import { Redis } from "ioredis";
import env from "./env";

export const pubClient = env.redisUrl
  ? new Redis(env.redisUrl, { family: 6 })
  : new Redis();
export const subClient = pubClient.duplicate();
