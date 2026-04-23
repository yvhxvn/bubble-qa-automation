import { Page } from '@playwright/test';

export class DescriptionPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private async pasteText(locator: any, text: string) {
        await locator.waitFor({ state: 'visible', timeout: 60000 });
        await locator.click();
        await locator.pressSequentially(text, { delay: 50 });
    }

    async fillDescription(placeholder: string, description: string) {
        await this.pasteText(
            this.page.locator(`.ql-editor[data-placeholder="${placeholder}"]`),
            description
        );
    }

    async fillDescriptionByIndex(index: number, description: string) {
        await this.pasteText(
            this.page.locator('.ql-editor').nth(index),
            description
        );
    }

    async fillDescriptionById(id: string, description: string) {
        await this.pasteText(
            this.page.locator(`#${id} > .ql-editor`),
            description
        );
    }

    async fillDescriptionByParagraph(description: string) {
        await this.pasteText(
            this.page.getByRole('paragraph'),
            description
        );
    }
}