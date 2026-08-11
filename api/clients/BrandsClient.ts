import type { APIRequestContext, APIResponse } from "@playwright/test";

export class BrandsClient {
    constructor(
        private request: APIRequestContext,
    ) {}

    async getAllBrands(): Promise<APIResponse> {
        return this.request.get("/brands");
    }
};
