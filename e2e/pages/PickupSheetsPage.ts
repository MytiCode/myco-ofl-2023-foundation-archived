import { BasePage } from "./BasePage";

export class PickupSheetsPage extends BasePage {
  async goto() {
    return this.page.goto("/pickup-sheets");
  }

  get initials() {
    return this.page.getByText("Initials");
  }

  get pickupDate() {
    return this.page.getByText("Pickup Date");
  }

  get arriveTime() {
    return this.page.getByText("Arrive Time");
  }

  get departTime() {
    return this.page.getByText("Depart Time");
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
              qty: lineItemEl.getByLabel("Quantity Fulfilled"),
              img: lineItemEl.getByRole("img"),
            };
          },
        };
      },
    };
  }
}
