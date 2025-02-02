import { HelmetOptions } from "helmet";

const helmetConfig: HelmetOptions = {
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  originAgentCluster: false,
  referrerPolicy: false,
  strictTransportSecurity: { maxAge: 31536000 },
  xDnsPrefetchControl: false,
  xDownloadOptions: false,
  xFrameOptions: { action: "deny" },
  xXssProtection: false,
};

export default helmetConfig;
