import { isProductResponse } from "../../api/validators/productValidator.js";
import { test, expect } from "../../fixtures/authenticated.fixture.js";

test("Favorite items are correctly added", async({ authenticatedPage, favoritesClient, productsClient, token }) => {
    const productsResponse = await productsClient.getProducts();
    expect(productsResponse.status()).toBe(200);

    const productsBody: unknown = await productsResponse.json();

    if (!isProductResponse(productsBody)) {
        throw new Error("First product does not have the expected format");
    }

    expect(productsBody.data.length).toBeGreaterThan(0);

    const product = productsBody.data[0];

    const productId = product.id;
    const productName = product.name;

    const favoritesResponse = await favoritesClient.addFavorite(token, productId);
    expect(favoritesResponse.status()).toBe(201);

    await authenticatedPage.goto("/account/favorites");

    await expect(authenticatedPage.getByTestId("product-name")).toHaveText(productName);
});
