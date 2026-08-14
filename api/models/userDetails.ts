export type UserDetails = {
    "first_name": string;
    "last_name": string;
    "address"?: Address;
    "phone"?: string;
    "dob"?: string;
    "password": string;
    "email": string;
};

export type Address = {
    "street"?: string;
    "house_number"?: string | null;
    "city"?: string;
    "state"?: string | null;
    "country"?: string;
    "postal_code"?: string | null;
};
