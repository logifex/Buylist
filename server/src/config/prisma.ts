import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import env from "./env.js";

const adapter = new PrismaPg({
  connectionString: env.databaseUrl,
  max: 10,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 300000,
  statement_timeout: 60000,
});
const prisma = new PrismaClient({ adapter });

export default prisma;
