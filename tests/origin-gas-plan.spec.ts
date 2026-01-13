 import { test, expect } from '@playwright/test';
import { PricingPage } from '../pages/PricingPage';
import { PlansPage } from '../pages/PlansPage';
import { PlanDetailsPage } from '../pages/PlanDetailsPage';
import { extractPdfText } from '../utils/pdfUtils';

test('Origin Energy – Gas plan PDF validation', async ({ page, context }) => {
  const pricingPage = new PricingPage(page);
  await pricingPage.goto();

  await pricingPage.searchAddress('17 Bolinda Road, Balwyn North, VIC 3104');

  const plansPage = new PlansPage(page);
  await plansPage.verifyPlansDisplayed();
   //await page.pause(); -> to clearly see the plans are displayed
  await plansPage.uncheckElectricity();
  await plansPage.verifyPlansDisplayed();
  //await page.pause();  -> to clearly see the plans are displayed after unchecking the electricity

  const [planPage] = await Promise.all([
    context.waitForEvent('page'),
    plansPage.clickPlanLink(),
  ]);

  await planPage.waitForLoadState('domcontentloaded');

  //await page.pause();-> to clearly see that it has opened in new tab
  const planDetails = new PlanDetailsPage(planPage);
  const pdfPath = await planDetails.downloadPlanPdf('test-results');

  const pdfText = await extractPdfText(pdfPath);
  expect(pdfText.toLowerCase()).toContain('gas');
});