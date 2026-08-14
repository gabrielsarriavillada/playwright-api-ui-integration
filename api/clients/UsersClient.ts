import type { APIRequestContext, APIResponse } from "@playwright/test";
import type { UserDetails } from "../models/userDetails.js";
import type { UserCredentials } from "../models/userCredentials.js";

export class UsersClient {
    constructor(private readonly request: APIRequestContext) {}

    registerUser(userDetails: UserDetails): Promise<APIResponse> {
        return this.request.post("/users/register", {
            data: userDetails
        });
    }

    loginUser(userCredentials: UserCredentials): Promise<APIResponse> {
        return this.request.post("/users/login", {
            data: {
                email: userCredentials.email,
                password: userCredentials.password,
            },
        });
    }

    getCurrentUser(token: string): Promise<APIResponse> {
        return this.request.get("/users/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
