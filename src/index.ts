import { PlatformExpress } from "@tsed/platform-express";
import { $log } from "@tsed/common";

import { Server } from "./Server";
import { connect } from "./database";
import synchronizeDB from "./database/Synchronize";

async function bootstrap() {
  try {
    $log.info("start server") 
    const platform = await PlatformExpress.bootstrap(Server);
    await platform.listen();
    await connect();
    await synchronizeDB();
  } catch (error) {
    $log.error("error status server", error.message) 
  }
}

bootstrap(); 
