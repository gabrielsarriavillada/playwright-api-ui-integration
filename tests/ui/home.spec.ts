import { test, expect } from "@playwright/test";

test("navigation to homepage", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL("/");
});
