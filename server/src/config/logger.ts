import winston from "winston";

const { combine, colorize, timestamp, errors, splat, simple, json } =
  winston.format;

const logger = winston.createLogger({
  level: "http",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS",
    }),
    errors({ stack: true }),
    splat(),
    json()
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), simple()),
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
  ],
});

export default logger;
