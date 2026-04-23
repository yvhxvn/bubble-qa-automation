import { Page, Locator, expect } from '@playwright/test';
export function generateProjectName(): string {
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}`;
    const uid = String(Date.now()).slice(-4);
    return `PR-${date}-${uid}`;
}

export async function typeInput(page: Page, placeholder: string, text: string) {
    const editor = page.locator(`.ql-editor[data-placeholder="${placeholder}"]`);
    await editor.waitFor({ state: 'visible', timeout: 30000 });
    await editor.click();
    await editor.pressSequentially(text, { delay: 50 });
    await expect(editor).not.toBeEmpty();
    
}

/* This function is crucial for the stability of the test suite. It clicks the "Save & Continue" button and waits for the next step to load, retrying if it fails. */
//async function next(page: Page, anchor: Locator, retries = 2) {
//  for (let i = 0; i <= retries; i++) {
//    try {
//      await expect(page.getByRole('button', { name: 'Save & Continue' }))
//        .toBeEnabled({ timeout: 10000 });
//      await page.getByRole('button', { name: 'Save & Continue' }).click();
//      await anchor.waitFor({ state: 'visible', timeout: 20000 });
//      return;
//    } catch {
//      if (i === retries) throw new Error(`Failed after ${retries + 1} attempts`);
//      console.log(`Retry ${i + 1}...`);
//      await page.waitForTimeout(200);
//    }
//  }
//}

export async function safeClick(locator: Locator) {
    await expect(locator).toBeEnabled({ timeout: 15000 });
    await expect(async () => {
        await locator.click();
    }).toPass({ timeout: 5000 });
}

