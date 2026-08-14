import { expect, test } from "../../fixtures/api.fixture.js";
import type { Brand } from "../../api/models/brand.js";

test.describe("Brands API", () => {
    test("should provide all brands", async ({ brandsClient }) => {
        const response = await brandsClient.getAllBrands();

        await expect(response).toBeOK();

        const brands: Brand[] = await response.json();

        expect(brands.length).toBeGreaterThan(0);
        expect(brands[0]).toHaveProperty("id");
        expect(brands[0]).toHaveProperty("name");
        expect(brands[0]).toHaveProperty("slug");

        expect(brands[0]).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                slug: expect.any(String),
            }),
        );
    });
}); 
