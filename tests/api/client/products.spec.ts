import { expect, test } from "@playwright/test";
import { Brand } from "../model/brand.js";
import { BrandApi } from "../../../api/BrandApi.js";

test.describe("Brands API", () => {
    test("should provide all brands", async ({ request }) => {
        const brandApi = new BrandApi(request);
        
        const getAllBrandsResponse = await brandApi.getAllBrands();

        await expect(getAllBrandsResponse).toBeOK();

        const brands: Brand[] = await getAllBrandsResponse.json();

        await expect(brands.length).toBeGreaterThan(0);
        await expect(brands[0]).toHaveProperty("id");
        await expect(brands[0]).toHaveProperty("name");
        await expect(brands[0]).toHaveProperty("slug");
    });
}); 
