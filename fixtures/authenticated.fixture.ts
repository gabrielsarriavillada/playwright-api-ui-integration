import type { Page } from "@playwright/test";
import { test as apiTest } from "./api.fixture.js";
import type { UserDetails } from "../api/models/userDetails.js";
import { createUserDetails } from "../api/helpers/createUserDetails.js";
import { authenticateUser } from "../api/helpers/authenticateUser.js";
import { createAuthStorageState } from "../api/helpers/createAuthStorageState.js";

type AuthenticatedFixture = {
    userDetails: UserDetails;
    authenticatedPage: Page;
    token: string;
};

export const test = apiTest.extend<AuthenticatedFixture>({
    userDetails: async ({}, use) => {
        const userDetails = createUserDetails();

        await use(userDetails);
    },

    authenticatedPage: async ({ token, browser }, use) => {
        const storageState = createAuthStorageState(token);
        const context = await browser.newContext({ storageState });
        const page = await context.newPage();

        await use(page);

        await context.close();
    },

    token: async ({ userDetails, usersClient }, use) => {
        const token = await authenticateUser(usersClient, userDetails);

        await use(token);
    },
});

export { expect } from "@playwright/test";
