import type { ProductsResponse } from "../../api/models/products.js";
import { test, expect } from "../../fixtures/authenticated.fixture.js";

test("Favorite items are correctly added", async({ authenticatedPage, favoritesClient, productsClient, token }) => {
    const productsResponse = await productsClient.getProducts();
    expect(productsResponse.status()).toBe(200);

    const productsBody: ProductsResponse = await productsResponse.json();
    expect(productsBody.data.length).toBeGreaterThan(0);

    const productId = productsBody.data[0].id;
    const productName = productsBody.data[0].name;

    const favoritesResponse = await favoritesClient.addFavorite(token, productId);
    expect(favoritesResponse.status()).toBe(201);

    await authenticatedPage.goto("/account/favorites");

    await expect(authenticatedPage.getByTestId("product-name")).toHaveText(productName);
});
