import { BasePage } from "./BasePage";

export class OrderTrackingSheetsPage extends BasePage {
  async goto() {
    return this.page.goto("/order-tracking-sheets");
  }
}
