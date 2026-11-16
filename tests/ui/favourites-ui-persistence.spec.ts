// spec: specs/favourites-ui-persistence.md
// exploration seed only: tests/ui/seed.spec.ts
import { test, expect } from "../../fixtures/authenticated.fixture.js";

test.describe("Single product favourite persistence", () => {
    test.describe.configure({ retries: 0 });

    test("A signed-in user adds one product from its product page and sees it exactly once after Favourites reload", async ({ authenticatedPage }, testInfo) => {
        const page = authenticatedPage;
        const productCards = page.locator('a[href^="/product/"]:visible').filter({
            has: page.getByTestId("product-name").filter({ hasText: /\S/ }),
        });
        // Retained DOM evidence places favourite cards beside page-title in its parent container.
        const favouritesContent = page.getByTestId("page-title").locator("..");
        const favouriteEntries = favouritesContent.getByTestId(/^favorite-/);
        const emptyState = page.getByText("There are no favorites yet.", { exact: false });

        // 1. Use the existing authenticated fixture and independently navigate to the catalogue.
        await page.goto("/");
        await expect(productCards.first()).toBeVisible();
        await expect(page.getByTestId("nav-menu")).toBeVisible();
        await page.getByTestId("nav-menu").click();
        await expect(page.getByRole("link", { name: "My favorites", exact: true })).toBeVisible();
        await expect(page.getByText("Sign out", { exact: true })).toBeVisible();

        // 2. Open My favorites and establish that the fresh user's loaded list is empty.
        await page.getByRole("link", { name: "My favorites", exact: true }).click();
        await expect(page).toHaveURL(/\/account\/favorites$/);
        await expect(page.getByRole("heading", { name: "Favorites", exact: true })).toBeVisible();
        await expect(emptyState).toBeVisible();
        await expect(favouriteEntries).toHaveCount(0);

        // 3. Select a visible catalogue product; capture its current name and href, then verify its product page.
        await page.getByRole("link", { name: "Home", exact: true }).click();
        const selectedCard = productCards.first();
        await expect(selectedCard).toBeVisible();
        const productName = (await selectedCard.getByTestId("product-name").innerText()).trim();
        const productHref = await selectedCard.getAttribute("href");
        expect(productName, "The selected catalogue product must have a non-empty name").not.toBe("");
        expect(productHref, "The selected catalogue product must link to a product page").toMatch(/^\/product\/[^/?#]+$/);
        const productUrl = new URL(productHref!, page.url()).href;
        await selectedCard.click();
        await expect(page).toHaveURL(productUrl);
        await expect(page.getByRole("heading", { level: 1, name: productName, exact: true })).toBeVisible();
        const addToFavourites = page.getByRole("button", { name: "Add to favourites", exact: true });
        await expect(addToFavourites).toBeVisible();
        await expect(addToFavourites).toBeEnabled();

        // 4. Add through the product page exactly once; preserve redacted evidence and fail on any rejected addition.
        const addResponsePromise = page.waitForResponse(
            response => response.request().method() === "POST" && new URL(response.url()).pathname === "/favorites",
            { timeout: 15_000 },
        );
        const [addResponse] = await Promise.all([addResponsePromise, addToFavourites.click()]);
        const evidence = {
            method: addResponse.request().method(),
            endpoint: new URL(addResponse.url()).origin + new URL(addResponse.url()).pathname,
            status: addResponse.status(),
        };
        await testInfo.attach("favourite-add-result", {
            body: JSON.stringify(evidence, null, 2),
            contentType: "application/json",
        });
        expect(addResponse.status(), `Addition failed; persistence is unverified. Evidence: ${JSON.stringify(evidence)}`).toBe(201);
        await expect(page.getByRole("alert")).toBeVisible();

        // 5. Open Favourites and assert one total entry whose title exactly matches the captured name.
        // Favourites matching is name-only: its card does not expose the captured product href/ID.
        await page.getByTestId("nav-menu").click();
        await page.getByRole("link", { name: "My favorites", exact: true }).click();
        await expect(page).toHaveURL(/\/account\/favorites$/);
        await expect(page.getByRole("heading", { name: "Favorites", exact: true })).toBeVisible();
        await expect(favouriteEntries).toHaveCount(1);
        await expect(favouriteEntries).toBeVisible();
        await expect(favouriteEntries.getByTestId("product-name")).toHaveText(productName);
        await expect(emptyState).toBeHidden();

        // 6. Reload once and repeat the total-entry count and exact-title assertion, retaining name-only identity.
        await page.reload();
        await expect(page).toHaveURL(/\/account\/favorites$/);
        await expect(page.getByRole("heading", { name: "Favorites", exact: true })).toBeVisible();
        await expect(favouriteEntries).toHaveCount(1);
        await expect(favouriteEntries).toBeVisible();
        await expect(favouriteEntries.getByTestId("product-name")).toHaveText(productName);
        await expect(emptyState).toBeHidden();
    });
});
