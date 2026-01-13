 import { Page, Locator, expect } from '@playwright/test';

export class PlansPage {
  readonly page: Page;
  readonly planLinks: Locator;
  readonly electricityCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;

    this.planLinks = page.locator(
      'a[href$=".pdf"], a:has-text("View"), a:has-text("EFS"), a:has-text("BPID")'
    );

    this.electricityCheckbox = page
      .locator('input[name="elc-checkbox"]')
      .filter({ has: page.locator(':visible') })
      .first();
  }

  async verifyPlansDisplayed() {
    await this.planLinks.first().waitFor({ state: 'visible', timeout: 30000 });
    await expect(this.planLinks.first()).toBeVisible({ timeout: 30000 });
  }

  async uncheckElectricity() {
    const checkboxes = this.page.locator('input[name="elc-checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      if (await checkbox.isVisible()) {
        if (await checkbox.isChecked()) {
          await checkbox.uncheck();
        }
        return;
      }
    }
  }

  async clickPlanLink() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.planLinks.first().click(),
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }
}