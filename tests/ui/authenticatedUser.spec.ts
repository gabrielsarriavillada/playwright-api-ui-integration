import { expect, test } from "../../fixtures/authenticated.fixture.js";

test("Authenticated user can access their account", async ({
    userDetails,
    authenticatedPage,
}) => {
    await authenticatedPage.goto("/account");

    await expect(authenticatedPage).toHaveURL(/\/account$/);

    await expect(authenticatedPage.getByTestId("nav-menu")).toContainText(
        `${userDetails.first_name} ${userDetails.last_name}`,
    );
});
