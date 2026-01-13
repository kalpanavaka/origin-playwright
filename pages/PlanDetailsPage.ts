 import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// This class handles downloading and saving the Plan PDF (EFS/BPID).
export class PlanDetailsPage {
  constructor(private page: Page) {}

  async downloadPlanPdf(downloadDir: string): Promise<string> {
    // 1. Create the folder to save the PDF if it doesn't exist yet
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const currentUrl = this.page.url();

    // 2. If the new tab opens the PDF directly in the browser
    if (currentUrl.toLowerCase().endsWith('.pdf')) {
      // Fetch the file content directly from the URL
      const response = await this.page.context().request.get(currentUrl);
      const buffer = await response.body();
      
      // Name the file based on the URL and save it to the folder
      const fileName = currentUrl.split('/').pop() || 'plan-details.pdf';
      const filePath = path.join(downloadDir, fileName);
      
      fs.writeFileSync(filePath, buffer);
      return filePath;
    }

    // 3. If the page is a landing page, find the PDF link and click it to download
    const pdfLink = this.page.locator('a[href*=".pdf"]').first();
    await pdfLink.waitFor({ state: 'attached', timeout: 10000 });

    const href = await pdfLink.getAttribute('href');
    if (!href) throw new Error('PDF link found but href is null');

    // Handle the browser download event and save the file
    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout: 20000 }),
      this.page.evaluate((url) => window.open(url, '_blank'), href),
    ]);

    const filePath = path.join(downloadDir, await download.suggestedFilename());
    await download.saveAs(filePath);

    return filePath;
  }
}
