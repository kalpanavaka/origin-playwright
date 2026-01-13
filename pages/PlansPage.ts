 import { Page, Locator, expect } from '@playwright/test';

// This class stores all the elements and actions for the Plans page.
export class PlansPage {
  readonly page: Page;
  readonly planLinks: Locator;
  readonly electricityCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;

    // Find links that look like a PDF or have words like "View" or "EFS" or "BPID"
    this.planLinks = page.locator(
      'a[href$=".pdf"], a:has-text("View"), a:has-text("EFS"), a:has-text("BPID")'
    );

    // Find the 'Electricity' checkbox, but only if it is actually visible on the screen
    this.electricityCheckbox = page
      .locator('input[name="elc-checkbox"]')
      .filter({ has: page.locator(':visible') })
      .first();
  }

  // Wait up to 30 seconds for the plans to appear on the page
  async verifyPlansDisplayed() {
    await this.planLinks.first().waitFor({ state: 'visible', timeout: 30000 });
    await expect(this.planLinks.first()).toBeVisible();
  }

  // Uncheck the electricity box. We use a loop to make sure we click the one the user sees.
  async uncheckElectricity() {
    const checkboxes = this.page.locator('input[name="elc-checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      if (await checkbox.isVisible()) {
        if (await checkbox.isChecked()) {
          await checkbox.uncheck();
        }
        return; // Stop once we find and handle the visible checkbox
      }
    }
  }

  // Click the plan link and wait for the new tab to open
  async clickPlanLink() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'), // Wait for the new tab
      this.planLinks.first().click(),           // Click the link
    ]);

    // Wait for the new page to finish loading its content
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }
}
