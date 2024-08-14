import { $log } from "@tsed/common";
import { Users, NewPasswords, Flow, FlowNodes, FlowEdges } from "@app/database";

export async function synchronizeDB() {
  try {
    await Users.sync({ alter: true });
    await NewPasswords.sync({ alter: true });
    await Flow.sync({ alter: true });
    await FlowNodes.sync({ alter: true });
    await FlowEdges.sync({ alter: true });
    $log.info("Done synchronize DB")
  } catch (error) {
    $log.error(error.message)
  }
}

synchronizeDB();