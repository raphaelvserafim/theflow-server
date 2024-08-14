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
