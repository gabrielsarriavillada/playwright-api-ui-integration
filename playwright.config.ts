import { defineConfig, devices } from "@playwright/test";
import { env } from "./config/env.js";

export default defineConfig({
    testDir: "./tests",

    use: {
        trace: "on-first-retry",
        testIdAttribute: "data-test",
    },

    projects: [
        {
            name: "ui",
            testMatch: "**/ui/**/*.spec.ts",
            use: {
                ...devices["Desktop Chrome"],
                baseURL: env.uiBaseUrl,
                screenshot: "only-on-failure",
            },
        },
        {
            name: "api",
            testMatch: "**/api/**/*.spec.ts",
            use: {
                baseURL: env.apiBaseUrl,
            },
        },
    ],
});
