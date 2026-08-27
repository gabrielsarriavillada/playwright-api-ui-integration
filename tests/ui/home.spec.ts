import { test, expect } from "@playwright/test";
import { ProductsPage } from "../../pages/ProductsPage.js";

test("Navigation to homepage", async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.goto();

    await expect(page).toHaveURL("/");
});

test("Filter products by category: pliers", async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.goto();
    await productsPage.filterByCategory("Pliers");
    
    await expect(productsPage.productNames).toHaveText([
        "Combination Pliers",
        "Pliers",
        "Bolt Cutters",
        "Long Nose Pliers",
        "Slip Joint Pliers",
    ]);
});
