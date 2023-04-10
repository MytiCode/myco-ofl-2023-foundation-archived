import { BasePage } from "./BasePage";

export class DeliveryLabelsPage extends BasePage {
  async goto() {
    return this.page.goto("/delivery-labels");
  }

  getLabel(orderNumber: string) {
    const el = this.page.getByLabel(orderNumber);
    return {
      el,
      logo: el.getByRole("img"),
    };
  }
}
