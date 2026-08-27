import { expect, test } from "../../fixtures/api.fixture.js";
import type { UserDetails } from "../../api/models/userDetails.js";
import type { UserResponse } from "../../api/models/userResponse.js";
import { createUserDetails } from "../../api/helpers/createUserDetails.js";

test.describe("Registration API", () => {
    test("Success registration", async ({ usersClient }) => {
        const userDetails = createUserDetails({ last_name: "Pierna" });

        const response = await usersClient.registerUser(userDetails);

        expect(response.status()).toBe(201);

        const responseBody: UserResponse = await response.json();

        expect(responseBody).toEqual(
            expect.objectContaining({
                first_name: userDetails.first_name,
                last_name: userDetails.last_name,
                email: userDetails.email,
            }),
        );
    });
});
