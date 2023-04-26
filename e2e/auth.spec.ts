import { expect } from "@playwright/test";
import { test } from "./util";

test("Can login", async ({ page, tokenSigner }) => {
  const userId = `trevor-testeroni`;
  const token = tokenSigner.sign({ userId }).unwrap();

  await page.goto("/");

  await page.getByLabel("WHO GOES THERE!").fill(token);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText(userId)).toBeVisible();
});

test("If I have an expired token, I'm asked to login", async ({ page }) => {});
