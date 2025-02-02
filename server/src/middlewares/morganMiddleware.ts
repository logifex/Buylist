import morgan from "morgan";
import { env, logger } from "../config";

const format = env.nodeEnv === "development" ? "dev" : "short";

const morganMiddleware = morgan(format, {
  skip: () => env.nodeEnv === "test",
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});

export default morganMiddleware;
