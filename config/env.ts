import "dotenv/config";

function requireEnv(envName: string): string {
    const value = process.env[envName];

    if (!value) {
        throw new Error(`Missing value for env ${envName}`);
    }

    return value;
}

export const env = {
    uiBaseUrl: requireEnv("UI_BASE_URL"),
    apiBaseUrl: requireEnv("API_BASE_URL"),
};
