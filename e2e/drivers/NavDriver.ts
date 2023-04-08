import { BaseDriver } from "./BaseDriver";

export class NavDriver extends BaseDriver {
  click(type: "pickup-sheets") {
    return this.getByType(type);
  }
}
