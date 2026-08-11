import { expect, test } from "@playwright/test";
import type { Brand } from "../../api/models/brand.js";
import { BrandsClient } from "../../api/clients/BrandsClient.js";

test.describe("Brands API", () => {
    test("should provide all brands", async ({ request }) => {
        const brandsClient = new BrandsClient(request);
        
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
