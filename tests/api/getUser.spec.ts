import { expect, test } from "../../fixtures/api.fixture.js";
import type { UserDetails } from "../../api/models/userDetails.js";
import type { UserResponse } from "../../api/models/userResponse.js";
import { authenticateUser } from "../../api/helpers/authenticateUser.js";

test.describe("Get user API", () => {
    test("authenticated user can retrieve its profile", async ({ usersClient }) => {

        const userDetails: UserDetails = {
            first_name: "Pepe",
            last_name: "Lorca",
            password: "Playwright0!",
            email: `test${Date.now()}@test.com`,
        };

        const token = await authenticateUser(usersClient, userDetails);

        const getUserResponse = await usersClient.getCurrentUser(token);

        expect(getUserResponse.status()).toBe(200);

        const getUserResponseBody: UserResponse = await getUserResponse.json();

        expect(getUserResponseBody).toEqual(expect.objectContaining({
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            email: userDetails.email,
        }));
    });
});
