import { z } from "zod";

const AddressSchema = z.object({
    street: z.string().nullable(),
    house_number: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
    postal_code: z.string().nullable(),
});

export const UserResponseSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    address: AddressSchema,
    phone: z.string().optional(),
    dob: z.string().optional(),
    email: z.string(),
    id: z.string().min(1),
    provider: z.string().optional(),
    totp_enabled: z.boolean().optional(),
    enabled: z.boolean().optional(),
    failed_login_attempts: z.number().optional(),
    created_at: z.string(),
});
