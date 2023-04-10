import { BasePage } from "./BasePage";

export class PickupSheetsPage extends BasePage {
  async goto() {
    return this.page.goto("/pickup-sheets");
  }
}
