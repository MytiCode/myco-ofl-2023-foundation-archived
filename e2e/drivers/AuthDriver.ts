import { Page } from "@playwright/test";
import { BaseDriver } from "./BaseDriver";
import { TokenSigner, User } from "e2e/auth";

const ACCESS_TOKEN_SESSION_KEY = "myti-auth";

export class AuthDriver extends BaseDriver {
  constructor(page: Page, private tokenSigner: TokenSigner) {
    super(page);
  }

  async forceLogin(token: string): Promise<void>;
  async forceLogin(user: User): Promise<void>;
  async forceLogin(userOrToken: any): Promise<void> {
    if (typeof userOrToken === "string") {
      const token = userOrToken;
      await this.page.goto("/?__sandbox");

      await this.page.evaluate(
        (params) => {
          window.localStorage.setItem(params.key, params.token);
        },
        {
          key: ACCESS_TOKEN_SESSION_KEY,
          token,
        }
      );
    } else {
      const user = userOrToken;
      const token = await this.tokenSigner.sign(user).unwrap();

      return await this.forceLogin(token);
    }
  }
}
