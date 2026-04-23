import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { morganMiddleware } from "./middlewares/index.js";
import {
  configZod,
  corsOptions,
  env,
  helmetConfig,
  logger,
} from "./config/index.js";
import routes from "./routes/index.js";
import { ErrorController } from "./controllers/index.js";
import { configSocket } from "./socket.js";

const PORT = env.port;

const app = express();
export const httpServer = createServer(app);

app.use(morganMiddleware);
app.use(helmet(helmetConfig));
app.use(cors(corsOptions));

configSocket(httpServer);
configZod();

app.use(routes);

app.use(ErrorController.handleNotFound);
app.use(ErrorController.errorHandlers);

httpServer.listen(PORT, () => {
  logger.info(
    `App is running at ${env.serverUrl ?? "undefined"}:${PORT.toString()}`,
  );
});

export default app;
