import { join } from "path";
import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/ajv";
import "@tsed/swagger";
import { config } from "@app/config/index";
import * as rest from "@app/controllers/api/index";
import * as pages from "@app/controllers/pages/index";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  disableComponentsScan: true,
  ajv: {
    returnsCoercedValues: true
  },
  mount: {
    "/v1": [
      ...Object.values(rest)
    ],
    "/": [
      ...Object.values(pages)
    ]
  },
  swagger: [
    {
      path: "/doc",
      options: {
        tryItOutEnabled: true,
      },
      spec: {
        info: {
          version: '2.0.0',
          title: 'Theflow Server',
        }
      },
    }
  ],
  statics: {
    "/uploads": join(process.cwd(), "uploads"),
    "/assets": join(process.cwd(), "assets")
  },
  middlewares: [
    "cors",
    "cookie-parser",
    "compression",
    "method-override",
    "json-parser",
    { use: "urlencoded-parser", options: { extended: true } }
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: [
    "**/*.spec.ts"
  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;
}