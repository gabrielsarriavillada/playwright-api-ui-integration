import { ProductsResponseSchema } from "../../api/schemas/products.js";
import { test, expect } from "../../fixtures/authenticated.fixture.js";

test("Favorite items are correctly added", async({ authenticatedPage, favoritesClient, productsClient, token }) => {
    const productsResponse = await productsClient.getProducts();
    expect(productsResponse.status()).toBe(200);

    const productsBody: unknown = await productsResponse.json();

    const result = ProductsResponseSchema.safeParse(productsBody);

    if (!result.success) {
        throw new Error(`Products response does not match the expected schema: ${result.error.message}`);
    }

    const validatedProducts = result.data;

    expect(validatedProducts.data.length).toBeGreaterThan(0);

    const product = validatedProducts.data[0];

    const productId = product.id;
    const productName = product.name;

    const favoritesResponse = await favoritesClient.addFavorite(token, productId);
    expect(favoritesResponse.status()).toBe(201);

    await authenticatedPage.goto("/account/favorites");

    await expect(authenticatedPage.getByTestId("product-name")).toHaveText(productName);
});
