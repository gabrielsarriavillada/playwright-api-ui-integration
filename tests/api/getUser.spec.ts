import { expect, test } from "@playwright/test";
import { UsersClient } from "../../api/clients/UsersClient.js";
import type { UserDetails } from "../../api/models/userDetails.js";
import type { UserCredentials } from "../../api/models/userCredentials.js";
import type { UserResponse } from "../../api/models/userResponse.js";
import type { LoginResponse } from "../../api/models/loginResponse.js";

test.describe("Get user API", () => {
    test("User is correctly authenticated", async ({ request }) => {
        const usersClient = new UsersClient(request);

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

        const token = loginResponseBody.access_token;

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
