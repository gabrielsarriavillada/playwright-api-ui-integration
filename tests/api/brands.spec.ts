import { expect, test } from "@playwright/test";
import type { Brand } from "../../api/model/brand.js";
import { BrandsClient } from "../../api/client/BrandsClient.js";

test.describe("Brands API", () => {
    test("should provide all brands", async ({ request }) => {
        const brandsClient = new BrandsClient(request);
        
        const getAllBrandsResponse = await brandsClient.getAllBrands();

        await expect(getAllBrandsResponse).toBeOK();

        const brands: Brand[] = await getAllBrandsResponse.json();

        expect(brands.length).toBeGreaterThan(0);
        expect(brands[0]).toHaveProperty("id");
        expect(brands[0]).toHaveProperty("name");
        expect(brands[0]).toHaveProperty("slug");
    });
}); 
