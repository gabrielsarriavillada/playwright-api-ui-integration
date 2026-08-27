import type { Locator, Page } from "@playwright/test";
import type { UserCredentials } from "../api/models/userCredentials.js";


export class LoginPage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor (private readonly page: Page) {
        this.emailInput = page.getByTestId("email");
        this.passwordInput = page.getByTestId("password");
        this.loginButton = page.getByTestId("login-submit");
    }

    async goto(): Promise<void> {
        await this.page.goto("/auth/login");
    }

    async login(user: UserCredentials): Promise<void> {
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
        await this.loginButton.click();
    }
}
