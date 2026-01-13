 import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class PlanDetailsPage {
  constructor(private page: Page) {}

  async downloadPlanPdf(downloadDir: string): Promise<string> {
    // 1. Ensure the directory exists
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const currentUrl = this.page.url();

    // 2. If the current page IS the PDF (Direct Navigation)
    if (currentUrl.toLowerCase().endsWith('.pdf')) {
      const response = await this.page.context().request.get(currentUrl);
      const buffer = await response.body();
      
      const fileName = currentUrl.split('/').pop() || 'plan-details.pdf';
      const filePath = path.join(downloadDir, fileName);
      
      fs.writeFileSync(filePath, buffer);
      return filePath;
    }

    // 3. Fallback: If it's a landing page, wait for the link (Your original logic)
    const pdfLink = this.page.locator('a[href*=".pdf"]').first();
    await pdfLink.waitFor({ state: 'attached', timeout: 10000 });

    const href = await pdfLink.getAttribute('href');
    if (!href) throw new Error('PDF link found but href is null');

    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout: 20000 }),
      this.page.evaluate((url) => window.open(url, '_blank'), href),
    ]);

    const filePath = path.join(downloadDir, await download.suggestedFilename());
    await download.saveAs(filePath);

    return filePath;
  }
}