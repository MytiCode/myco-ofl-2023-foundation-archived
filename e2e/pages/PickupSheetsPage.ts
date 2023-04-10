import { BasePage } from "./BasePage";

export class PickupSheetsPage extends BasePage {
  async goto() {
    return this.page.goto("/pickup-sheets");
  }

  getShop(name: string) {
    const el = this.page.getByLabel(name);
    return {
      el,
      getOrder(orderNumber: string) {
        const orderEl = el.getByLabel(orderNumber);
        return {
          el: orderEl,
          getLineItem(title: string) {
            const lineItemEl = orderEl.getByLabel(title);
            return {
              el: lineItemEl,
              qty: lineItemEl.getByLabel("QTY Ordered"),
              img: lineItemEl.getByRole("img"),
            };
          },
        };
      },
    };
  }
}
