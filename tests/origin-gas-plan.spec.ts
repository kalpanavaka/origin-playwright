 import { test, expect } from '@playwright/test';
import { PricingPage } from '../pages/PricingPage';
import { PlansPage } from '../pages/PlansPage';
import { PlanDetailsPage } from '../pages/PlanDetailsPage';
import { extractPdfText } from '../utils/pdfUtils';

test('Origin Energy – Gas plan PDF validation', async ({ page, context }) => {
  // 1. Navigate to the pricing page and enter the test address
  const pricingPage = new PricingPage(page);
  await pricingPage.goto();
  await pricingPage.searchAddress('17 Bolinda Road, Balwyn North, VIC 3104');

  const plansPage = new PlansPage(page);
  await plansPage.verifyPlansDisplayed();
    // 2. Filtered the results to show Gas plans only
  await plansPage.uncheckElectricity();
  await plansPage.verifyPlansDisplayed();

  // 3. Click the first plan and wait for it to open in a new tab
  const [planPage] = await Promise.all([
    context.waitForEvent('page'),
    plansPage.clickPlanLink(),
  ]);

  await planPage.waitForLoadState('domcontentloaded');

  // 4. Download the PDF from the new tab and save it to the test-results folder
  const planDetails = new PlanDetailsPage(planPage);
  const pdfPath = await planDetails.downloadPlanPdf('test-results');

  // 5. Read the PDF content and verify it contains the word "gas"
  const pdfText = await extractPdfText(pdfPath);
  expect(pdfText.toLowerCase()).toContain('gas');
});
