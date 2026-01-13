 import { Page, Locator, expect } from '@playwright/test';

export class PricingPage {
  readonly page: Page;
  readonly addressInput: Locator;
  readonly cookieAcceptButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Based on the HTML you provided: data-id="connectionAddressInput-autocomplete-textfield-input"
    this.addressInput = page.locator('[data-id="connectionAddressInput-autocomplete-textfield-input"]');
    
    this.cookieAcceptButton = page.locator(
      'button:has-text("Accept"), button:has-text("Agree")'
    );
  }

  async goto() {
    await this.page.goto('https://www.originenergy.com.au/pricing.html');

    if (await this.cookieAcceptButton.first().isVisible({ timeout: 5000 })) {
      await this.cookieAcceptButton.first().click();
    }

    await expect(this.addressInput).toBeVisible({ timeout: 30000 });
  }

  async searchAddress(address: string) {
    await this.addressInput.fill(address);

    // This matches the role="combobox" behavior in your HTML
    const firstOption = this.page.locator('[role="option"]').first();
    await expect(firstOption).toBeVisible({ timeout: 15000 });

    await firstOption.click();
  }
}