/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv-flow").config();

import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import type { SessionOptions } from "express-session";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import morgan from "morgan";
import pg from "pg";
import session from "express-session";
// import { WinstonModule } from "nest-winston";
// import { LogtailTransport } from "@logtail/winston";
import { Logtail } from "@logtail/node";

const SESSION_TTL = 1000 * 60 * 60 * 12;

const pgSession = require("connect-pg-simple")(session);

const ssl =
  process.env.NODE_ENV === "production"
    ? {
        rejectUnauthorized: false,
      }
    : false;

const pool = new pg.Pool({
  ssl,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});

const sessionParams: SessionOptions = {
  resave: false,
  rolling: true,
  saveUninitialized: false,
  name: process.env.SESSION_NAME,
  secret: process.env.COOKIE_SECRET,
  store: new pgSession({
    pool,
  }),
  cookie: {
    maxAge: SESSION_TTL,
    httpOnly: true,
    secure: "auto",
  },
};

export const logtail = new Logtail(process.env.LOGTAIL_TOKEN);

(async () => {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "log"],
    // process.env.NODE_ENV === "production"
    //   ? WinstonModule.createLogger({
    //       transports: new LogtailTransport(logtail),
    //     })
    //   : ["log", "error", "warn"],
  });

  app.use(morgan("tiny"));
  app.use(helmet());

  app.enableCors({
    credentials: true,
    origin:
      process.env.FE_DOMAIN === "localhost"
        ? true
        : new RegExp(`${process.env.FE_DOMAIN}$`),
  });

  app.use(session(sessionParams));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT);
  console.log(`running on port ${process.env.PORT}`);
})();
