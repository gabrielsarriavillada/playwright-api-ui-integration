import type { APIRequestContext, APIResponse } from "@playwright/test";

export class FavoritesClient {
    constructor(private readonly request: APIRequestContext) {}

    addFavorite(token: string, productId: string): Promise<APIResponse> {
        return this.request.post("/favorites", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                product_id: productId,
            },
        });
    }
}
