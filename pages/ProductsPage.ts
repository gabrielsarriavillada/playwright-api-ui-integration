import type { Locator, Page } from "@playwright/test";

export class ProductsPage {
    readonly productNames: Locator;

    constructor(
        private readonly page: Page,
    ) {
        this.productNames = this.page.getByTestId("product-name");
    }

    async goto(): Promise<void> {
        await this.page.goto("/");
    }

    async filterByCategory(category: string): Promise<void> {
        await this.page.locator("label").filter({ hasText: category }).getByRole("checkbox").click();
    }
}
