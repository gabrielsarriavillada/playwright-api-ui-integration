import { request as playwrightRequest, test as base } from "@playwright/test";
import type { APIRequestContext } from "@playwright/test";
import { BrandsClient } from "../api/clients/BrandsClient.js";
import { UsersClient } from "../api/clients/UsersClient.js";
import { FavoritesClient } from "../api/clients/FavoritesClient.js";
import { ProductsClient } from "../api/clients/ProductsClient.js";
import { env } from "../config/env.js";

type ApiFixtures = {
    apiContext: APIRequestContext;
    brandsClient: BrandsClient;
    usersClient: UsersClient;
    favoritesClient: FavoritesClient;
    productsClient: ProductsClient;
};

export const test = base.extend<ApiFixtures>({
    apiContext: async ({}, use) => {
        const apiContext = await playwrightRequest.newContext({
            baseURL: env.apiBaseUrl,
        });

        await use(apiContext);

        await apiContext.dispose();
    },

    usersClient: async ({ apiContext }, use) => {
        await use(new UsersClient(apiContext));
    },

    brandsClient: async ({ apiContext }, use) => {
        await use(new BrandsClient(apiContext));
    },

    favoritesClient: async ({ apiContext }, use) => {
        await use(new FavoritesClient(apiContext));
    },
    
    productsClient: async ({ apiContext }, use) => {
        await use(new ProductsClient(apiContext));
    },
});

export { expect } from "@playwright/test";
