import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TokenSigner, User } from "e2e/auth";

export class LoginPage extends BasePage {
  constructor(page: Page, private tokenSigner: TokenSigner) {
    super(page);
  }

  async goto() {
    return this.page.goto("/");
  }

  get invalidTokenMessage() {
    return this.page.getByText("Invalid token");
  }

  async login(token: string): Promise<void>;
  async login(user: User): Promise<void>;
  async login(userOrToken: any): Promise<void> {
    if (typeof userOrToken === "string") {
      const token = userOrToken;

      await this.goto();
      await this.page.getByLabel("Token").fill(token);
      await this.page.getByRole("button", { name: "Login" }).click();
    } else {
      const user = userOrToken;
      const token = await this.tokenSigner.sign(user).unwrap();

      return await this.login(token);
    }
  }
}
