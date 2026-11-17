// spec: specs/favourites-ui-persistence.md
// exploration seed only: tests/ui/seed.spec.ts
import { test } from "../../fixtures/authenticated.fixture.js";
import { favouritesPersistenceJourney } from "../support/favourites-persistence-journey.js";

test.describe("Single product favourite persistence", () => {
    test.describe.configure({ retries: 0 });

    test("A signed-in user adds one product from its product page and sees it exactly once after Favourites reload", async ({ authenticatedPage }, testInfo) => {
        await favouritesPersistenceJourney(authenticatedPage, testInfo);
    });
});
