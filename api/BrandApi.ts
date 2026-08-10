import { APIRequestContext, APIResponse } from "@playwright/test";

export class BrandApi {
    constructor(
        private request: APIRequestContext,
    ) {}

    async getAllBrands(): Promise<APIResponse> {
        return await this.request.get("/brands");
    }
};
