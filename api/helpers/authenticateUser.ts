import { expect } from "@playwright/test";
import { UsersClient } from "../clients/UsersClient.js";
import type { UserDetails } from "../models/userDetails.js";
import type { UserCredentials } from "../models/userCredentials.js";
import type { LoginResponse } from "../models/loginResponse.js";

export async function authenticateUser(usersClient: UsersClient, userDetails: UserDetails): Promise<string> {
    const registrationResponse = await usersClient.registerUser(userDetails);

    expect(registrationResponse.status()).toBe(201);

    const userCredentials: UserCredentials = {
        email: userDetails.email,
        password: userDetails.password,
    };

    const loginResponse = await usersClient.loginUser(userCredentials);

    expect(loginResponse.status()).toBe(200);

    const loginResponseBody: LoginResponse = await loginResponse.json();

    return loginResponseBody.access_token;
}
