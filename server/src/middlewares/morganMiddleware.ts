import morgan from "morgan";
import { env, logger } from "../config/index.js";

const format = env.nodeEnv === "development" ? "dev" : "short";

const morganMiddleware = morgan(format, {
  skip: (req) => env.nodeEnv === "test" || req.url === "/healthz",
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});

export default morganMiddleware;
