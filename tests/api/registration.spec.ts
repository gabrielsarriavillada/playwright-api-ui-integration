import { expect, test } from "../../fixtures/api.fixture.js";
import { createUserDetails } from "../../api/helpers/createUserDetails.js";
import { UserResponseSchema } from "../../api/schemas/users.schema.js";

test.describe("Registration API", () => {
    test("Success registration", async ({ usersClient }) => {
        const userDetails = createUserDetails({ first_name: "Josepe" });

        const response = await usersClient.registerUser(userDetails);

        expect(response.status()).toBe(201);

        const responseBody: unknown = await response.json();

        const result = UserResponseSchema.safeParse(responseBody);

        if (!result.success) {
            throw new Error(`User registration response does not match the expected schema: ${result.error.message}`);
        }

        const validatedUser = result.data;

        expect(validatedUser).toEqual(
            expect.objectContaining({
                first_name: userDetails.first_name,
                last_name: userDetails.last_name,
                email: userDetails.email,
            }),
        );
    });
});
