import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";
import rootConfig from "../../playwright.config.js";

const uiProject = rootConfig.projects?.find(project => project.name === "ui");
if (!uiProject) {
    throw new Error("The effectiveness suite requires the existing ui project settings");
}

export default defineConfig({
    testDir: ".",
    testMatch: "favourites-persistence.spec.ts",
    fullyParallel: false,
    workers: 1,
    retries: 0,
    maxFailures: 0,
    outputDir: "../../test-results/effectiveness",
    reporter: [
        ["list"],
        ["json", { outputFile: fileURLToPath(new URL("../../test-results/effectiveness/results.json", import.meta.url)) }],
        ["html", { outputFolder: fileURLToPath(new URL("../../playwright-report/effectiveness", import.meta.url)), open: "never" }],
    ],
    use: { ...rootConfig.use, ...uiProject.use },
    projects: [{ name: "effectiveness" }],
});
