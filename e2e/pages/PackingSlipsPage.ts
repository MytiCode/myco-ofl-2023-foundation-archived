import { BasePage } from "./BasePage";

export class PackingSlipsPage extends BasePage {
  async goto() {
    return this.page.goto("/packing-slips");
  }

  getOrder(orderNumber: string) {
    const orderEl = this.page.getByLabel(orderNumber);
    return {
      el: orderEl,
      getShop(name: string) {
        const shopEl = orderEl.getByLabel(name);
        return {
          el: shopEl,
          getLineItem(title: string) {
            const lineItemEl = shopEl.getByLabel(title);
            return {
              el: lineItemEl,
              qty: lineItemEl.getByLabel("Quantity Fulfilled"),
              img: lineItemEl.getByRole("img"),
            };
          },
        };
      },
    };
  }

  get initials() {
    return this.page.getByText("Initials");
  }
}
