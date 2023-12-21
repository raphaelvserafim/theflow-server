import { PlatformExpress } from "@tsed/platform-express";
import { Server } from "./Server";
import Database from "./database";

declare global {
  var database: Database;
}

async function bootstrap() {
  try {
    console.log("start server")
    const platform = await PlatformExpress.bootstrap(Server);
    await platform.listen();
    global.database = new Database();
  } catch (error) {
    console.error("error status server", error)
  }
}

bootstrap(); 
