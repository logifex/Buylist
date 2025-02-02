import express from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { morganMiddleware } from "./middlewares";
import { configZod, corsOptions, env, helmetConfig, logger } from "./config";
import routes from "./routes";
import { ErrorController } from "./controllers";
import { configSocket } from "./socket";

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
  logger.info(`App is running at ${env.serverUrl}:${PORT}`);
});

export default app;
