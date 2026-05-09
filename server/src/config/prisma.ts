import os from "os";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import env from "./env.js";

const cpuCount = os.cpus().length;
const dynamicMax = cpuCount * 2 + 1;

const adapter = new PrismaPg({
  connectionString: env.databaseUrl,
  max: dynamicMax,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 300000,
  statement_timeout: 60000,
});
const prisma = new PrismaClient({ adapter });

export default prisma;
