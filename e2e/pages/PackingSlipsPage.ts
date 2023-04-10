import { BasePage } from "./BasePage";

export class PackingSlipsPage extends BasePage {
  async goto() {
    return this.page.goto("/packing-slips");
  }

  getOrder(orderNumber: string) {
    return this.page.getByLabel(orderNumber);
  }

  get initials() {
    return this.page.getByText("Initials");
  }
}
