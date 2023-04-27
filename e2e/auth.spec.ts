import { expect } from "@playwright/test";
import { test } from "./util";

// TODO(benglass): Encapsulate in a LoginPage but this is the only user atm
test("Can login", async ({ page, login }) => {
  const userId = `trevor-testeroni`;

  await login.login({ userId });

  await expect(page.getByText(userId)).toBeVisible();
});

test("If I provide an invalid token, I get an error", async ({ login }) => {
  await login.login("no-way-jose");
  await expect(login.invalidTokenMessage).toBeVisible();
});

const expiredAccessToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtbXljby1hdXRoIn0.eyJzdWIiOiJiZW4iLCJpYXQiOjE2Nzk4NDQ1NDguODA5fQ.KKYf0DzgcuX5i1Q7MKAt9AV_MrldXYkC-mFLMhYaXNFsft4FzgfXMDs0ahmr3EF4ijPulPrnl8VnRd-aP_HAmOjs4ol905sTj3BChwA1tHnR4LMSS2JSX3PHadMPpzAaa5GqxiXG54711qNLKaIihy7Cf-6-3lL3Uk9EdcwlIkGSr_ib5QJj6ZtIQx6HcgQja1rTfTpJbkl5hgUGeyJRN_ZIuyz_xlX-QeL7URBjiUzPQkboAL7G7Oq3jVZHv4_nXzO5bTIG6ePcKAWeBtSsiufXywxwPVL0_nxecFXaz1AaDQEILj_8azEGyLLbXPCoZ8YPfZBeUR7_SindfFa2qd8fMiV82Je7LhrGT8u-FHuZ60iPXzGv9zyKdnRQMzIO-XLrMbXCO6kQ8eTuRILxcwfr_YX4MYf1wQq4ph7E01BP38CuO7JP0bccHzYGBxTwO2d3Cs7lRDVqBbrY5T0t2dgJrVz-TU5rpSB4kCNF5JnuYoQUXp_szAJ23lJ89eVCwXM-ILR3u4axmOrm7MqJ7IkLtXq2EL3m3fX_2Y7VPpoq9HuOVSY6KbqI6-gKaUO9zKZO1F7uBjR-x62yHJC6lqxhC6xBzKqZ8Tt4pjfHG6Goj1h4yOoBsQI9rI-tdWyyfVKKR_nhHtG01IvpyGzq0g-dZsWt1EaUwf6I-HwvF14";

test("If I provide an expired token, I'm asked to login", async ({ login }) => {
  await login.login(expiredAccessToken);
  await expect(login.invalidTokenMessage).toBeVisible();
});

test("If I have a remembered token that is not expired, I'm asked to login", async ({
  login,
  auth,
}) => {
  await auth.forceLogin(expiredAccessToken);
  await login.goto();
  await expect(login.invalidTokenMessage).toBeVisible();
});
