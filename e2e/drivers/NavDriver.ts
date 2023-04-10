import { BaseDriver } from "./BaseDriver";

type NavType =
  | "pickup-sheets"
  | "packing-slips"
  | "delivery-labels"
  | "order-tracking-sheets";

export class NavDriver extends BaseDriver {
  click(type: NavType) {
    return this.getByType(`nav-${type}`).click();
  }
}
