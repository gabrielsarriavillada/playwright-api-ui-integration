import { expect, test } from "../../fixtures/api.fixture.js";
import type { UserCredentials } from "../../api/models/userCredentials.js";
import type { LoginResponse } from "../../api/models/loginResponse.js";
import type { UserDetails } from "../../api/models/userDetails.js";

test.describe("Login API", () => {
    test("Success login with new registered user", async ({ usersClient }) => {
        const userDetails: UserDetails = {
            first_name: "Pepe",
            last_name: "Lorca",
            password: "Playwright0!",
            email: `test${Date.now()}@test.com`,
        };

        const registrationResponse = await usersClient.registerUser(userDetails);

        expect(registrationResponse.status()).toBe(201);

        const userCredentials: UserCredentials = {
            email: userDetails.email,
            password: userDetails.password,
        };

        const loginResponse = await usersClient.loginUser(userCredentials);

        expect(loginResponse.status()).toBe(200);

        const loginResponseBody: LoginResponse = await loginResponse.json();

        expect(loginResponseBody).toEqual(expect.objectContaining({
            access_token: expect.any(String),
            token_type: "bearer",
            expires_in: expect.any(Number),
        }));
    });
});
