import type { Address } from "./userDetails.js";

export type UserResponse = {
    "first_name": string;
    "last_name": string;
    "address": Address;
    "phone": string | null;
    "dob": string | null;
    "email": string;
    "id": string;
    "provider": string | null;
    "totp_enabled": boolean;
    "enabled": boolean;
    "failed_login_attempts": number | null;
    "created_at": string;
}
