import { test as base } from "@playwright/test";
import { BrandsClient } from "../api/clients/BrandsClient.js";
import { UsersClient } from "../api/clients/UsersClient.js";

type ApiFixtures = {
    brandsClient: BrandsClient;
    usersClient: UsersClient;
};

export const test = base.extend<ApiFixtures>({
    usersClient: async ({ request }, use) => {
        await use(new UsersClient(request));
    },

    brandsClient: async ({ request }, use) => {
        await use(new BrandsClient(request));
    },
});

export { expect } from "@playwright/test";
