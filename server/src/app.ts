import "./instrument.js";

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

const PORT = parseInt(env.port, 10);

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

httpServer.listen(PORT, env.host, () => {
  logger.info(
    `App is running at ${env.host ?? env.serverUrl}:${PORT.toString()}`,
  );
});

export default app;
