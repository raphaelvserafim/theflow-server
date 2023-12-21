import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/swagger";
import { join } from "path";
import "@tsed/platform-express";
import "@tsed/swagger";

import { NotFoundMiddleware } from "./middlewares";

const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 3001,
  httpsPort: false,
  logger: {
    debug: false,
    logRequest: false,
    requestFields: ["reqId", "method", "url", "headers", "query", "params", "duration"]
  },
  mount: {
    "/auth": [`${rootDir}/controllers/Auth.ts`],
  },
  swagger: [
    {
      path: "/docs",
      options: {
        tryItOutEnabled: true,
      },
      spec: {
        info: {
          version: '1.0.0',
          title: 'Server TS',
          description: 'Base server TS',
        }
      },
    }
  ],
  statics: {
    "/statics": join(__dirname, "..", "statics")
  },
  exclude: ["**/*.spec.ts"],
})

export class Server {
  @Inject()
  app: PlatformApplication;
  @Configuration()
  settings: Configuration;
  $beforeRoutesInit(): void {
    this.app.use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json({ limit: '150mb' }))
      .use(bodyParser.urlencoded({ extended: true, limit: '150mb' }));
  }
  public $afterRoutesInit() {
    this.app.use(NotFoundMiddleware);
  }
}