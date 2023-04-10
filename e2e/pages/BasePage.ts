import { Page } from "@playwright/test";
import { BaseDriver } from "../drivers/BaseDriver";
import { NavDriver } from "../drivers/NavDriver";

export abstract class BasePage extends BaseDriver {
  readonly nav: NavDriver;

  constructor(readonly page: Page, nav: NavDriver = new NavDriver(page)) {
    super(page);
    this.nav = nav;
  }

  forPrint() {
    return this.page.emulateMedia({ media: "print" });
  }
}
