import { CorsOptions } from "cors";
import env from "./env";

const origins: string[] = [
  env.clientUrl,
  ...(env.secondaryClientUrl ? [env.secondaryClientUrl] : []),
];

const corsOptions: CorsOptions = {
  origin: origins,
  allowedHeaders: ["Authorization", "Content-Type", "fly-force-instance-id"],
  maxAge: 86400,
};

export default corsOptions;
