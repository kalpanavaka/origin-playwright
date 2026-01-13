  import { Page, Locator, expect } from '@playwright/test';

// This class handles the initial page where we enter the address.
export class PricingPage {
  readonly page: Page;
  readonly addressInput: Locator;
  readonly cookieAcceptButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locator for the address search box using its unique data-id
    this.addressInput = page.locator('[data-id="connectionAddressInput-autocomplete-textfield-input"]');
    
    // Locator for common cookie pop-ups to ensure they don't block our clicks
    this.cookieAcceptButton = page.locator(
      'button:has-text("Accept"), button:has-text("Agree")'
    );
  }

  // Navigates to the page and handles any pop-ups or loading delays
  async goto() {
    await this.page.goto('https://www.originenergy.com.au/pricing.html');

    // If a cookie banner appears, click it so we can see the rest of the page
    if (await this.cookieAcceptButton.first().isVisible({ timeout: 5000 })) {
      await this.cookieAcceptButton.first().click();
    }

    // Ensure the address input is ready before we try to type
    await expect(this.addressInput).toBeVisible({ timeout: 30000 });
  }

  // Types the address and selects the first match from the dropdown list
  async searchAddress(address: string) {
    await this.addressInput.fill(address);

    // Wait for the address suggestions to appear and click the first one
    const firstOption = this.page.locator('[role="option"]').first();
    await expect(firstOption).toBeVisible({ timeout: 15000 });

    await firstOption.click();
  }
}
