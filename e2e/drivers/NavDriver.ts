import { BaseDriver } from "./BaseDriver";

type NavType = "pickup-sheets" | "packing-slips" | "delivery-labels";
export class NavDriver extends BaseDriver {
  click(type: NavType) {
    return this.getByType(`nav-${type}`).click();
  }
}
