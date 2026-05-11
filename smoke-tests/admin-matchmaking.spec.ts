import { expect, test } from '@playwright/test';
import { config } from '../helpers/config';
import { LoginPage } from '../pom/LoginPage';

test('admin-matchmaking', async ({ page }) => {
    const PR_NAME = config.prName;
    const DP_NAME = config.dp.name;
    const loginPage = new LoginPage(page);
    await page.goto(`${config.baseURL}`);
    await loginPage.login(config.admin.email, config.admin.password);

    await page.getByText('Proposals', { exact: true })
        .filter({ hasText: 'Proposals' })
        .click();
    await page.getByRole('textbox', { name: 'Search' })
        .waitFor({ state: 'visible' });
    await page.getByRole('textbox', { name: 'Search' })
        .pressSequentially(PR_NAME, { delay: 100 });
    await page.waitForTimeout(1000);
    
    await page.locator('div')
        .filter({ hasText: PR_NAME })
        .first()
        .waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'View' })
        .first()
        .click();
    await page.getByRole('button', { name: 'Actions' })
        .waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Actions' })
        .click();
    await page.locator('div')
        .filter({ hasText: 'Accept'})
        .nth(2)
        .click();
    await page.getByRole('button', { name: 'Accept' })
        .click();
    await page.locator('#ChooseDPsmartSearch')
        .waitFor({ state: 'visible' });
    await page.locator('#ChooseDPsmartSearch')
        .pressSequentially(DP_NAME, { delay: 30 });
    await page.locator('.clickable-element.bubble-element.Icon.baTcaWj')
        .first()
        .click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Assign Teams' })
        .click({ force: true });
    await page.waitForTimeout(2000);

    await expect(page.getByText('Selection')
        .first())
        .toBeVisible({ timeout: 20000 });
    console.log(`Done: PR ${PR_NAME} status is now Selection`);
});