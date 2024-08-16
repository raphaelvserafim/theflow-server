import { Example, Property } from "@tsed/schema";

export class flowCreate {
  @Property()
  @Example("My Flow 1")
  name: string;
}

export class flowSaveNodes {
  @Property()
  @Example("de8583-75a59f-s9eis")
  id: string;
  @Property()
  @Example("text_message")
  type: string;
  @Property()
  @Example({ x: 438, y: 207 })
  position: {
    x: number;
    y: number;
  };
}


export class flowUpdatePositionNodes {
  @Property()
  @Example({ x: 438, y: 207 })
  position: {
    x: number;
    y: number;
  };
}

export class flowUpdateContentNodes {
  @Property()
  @Example("Oi")
  text_content?: string;
}

export class flowConnectEdges {
  @Property()
  @Example("de8583-75a59f-zru9169orn")
  source: string;
  @Property()
  @Example("de8583-75a59f-656n57i1r8")
  target: string;
}