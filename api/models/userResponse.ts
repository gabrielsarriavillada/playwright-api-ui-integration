import { Address } from "./userDetails.js";

export type UserResponse = {
    "first_name": string;
    "last_name": string;
    "address": Address;
    "phone": string;
    "dob": string;
    "email": string;
    "id": string;
    "provider": string;
    "totp_enabled": boolean;
    "enabled": boolean;
    "failed_login_attempts": number;
    "created_at": string;
}
