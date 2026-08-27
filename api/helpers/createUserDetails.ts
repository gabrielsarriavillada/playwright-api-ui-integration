import type { UserDetails } from "../models/userDetails.js";

export function createUserDetails(userDetails: Partial<UserDetails> = {}): UserDetails {
    return {
        "first_name": userDetails.first_name ?? "Pepe",
        "last_name": userDetails.last_name ?? "Lorca",
        "password": userDetails.password ?? "Playwright0!",
        "email": userDetails.email ?? `test${Date.now()}@test.com`,
    }
}
