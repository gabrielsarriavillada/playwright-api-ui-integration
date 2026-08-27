import { test, expect } from "../../fixtures/authenticated.fixture.js";


test("Correct options in left menu for authenticated user", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/account");

    await expect(authenticatedPage.getByTestId("nav-favorites")).toBeVisible();
    await expect(authenticatedPage.getByTestId("nav-profile")).toBeVisible();
    await expect(authenticatedPage.getByTestId("nav-invoices")).toBeVisible();
    await expect(authenticatedPage.getByTestId("nav-messages")).toBeVisible();
});
