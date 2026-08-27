import { request as playwrightRequest, test as base } from "@playwright/test";
import { BrandsClient } from "../api/clients/BrandsClient.js";
import { UsersClient } from "../api/clients/UsersClient.js";
import { env } from "../config/env.js";

type ApiFixtures = {
    brandsClient: BrandsClient;
    usersClient: UsersClient;
};

export const test = base.extend<ApiFixtures>({
    usersClient: async ({}, use) => {
        const apiContext = await playwrightRequest.newContext({
            baseURL: env.apiBaseUrl,
        });

        await use(new UsersClient(apiContext));

        await apiContext.dispose();
    },

    brandsClient: async ({}, use) => {
        const apiContext = await playwrightRequest.newContext({
            baseURL: env.apiBaseUrl,
        });

        await use(new BrandsClient(apiContext));

        await apiContext.dispose();
    },
});

export { expect } from "@playwright/test";
