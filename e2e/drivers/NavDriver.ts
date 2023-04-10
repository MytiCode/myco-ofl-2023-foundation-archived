import { BaseDriver } from "./BaseDriver";

type NavType = "pickup-sheets" | "packing-slips";
export class NavDriver extends BaseDriver {
  click(type: NavType) {
    return this.getByType(type);
  }
}
