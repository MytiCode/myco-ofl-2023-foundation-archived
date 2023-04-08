import { Page } from "@playwright/test";

export abstract class BaseDriver {
  constructor(readonly page: Page) {}

  getByType(type: string) {
    return this.page.locator(`[data-type="${type}"]`);
  }
}
