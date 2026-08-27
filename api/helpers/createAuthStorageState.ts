import type { BrowserContextOptions } from "@playwright/test";
import { env } from "../../config/env.js";

export function createAuthStorageState(token: string): BrowserContextOptions["storageState"] {
    return {
        cookies: [],
        origins: [
            {
                origin: env.uiBaseUrl,
                localStorage: [
                    {
                        name: "auth-token",
                        value: token,
                    },
                ],
            },
        ],
    };
}
