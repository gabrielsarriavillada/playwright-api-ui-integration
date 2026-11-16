import { test } from "../../fixtures/authenticated.fixture.js";
import { env } from "../../config/env.js";

test("seed", async ({ authenticatedPage }) => {
    await authenticatedPage.goto(env.uiBaseUrl);
});
