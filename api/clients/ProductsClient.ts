import type { APIRequestContext, APIResponse } from "@playwright/test";

export class ProductsClient {
    constructor(private readonly request: APIRequestContext) {}

    getProducts(): Promise<APIResponse> {
        return this.request.get("/products");
    }
}
