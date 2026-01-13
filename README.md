# set up
git clone https://github.com/kalpanavaka/origin-playwright.git
cd origin-playwright
# Dependencies: 
npm install
npx playwright install chromium

# Run Locally

npx playwright test --headed
npx playwright show-report

# Test Artifacts

PDF downloads → test-results/

HTML report → playwright-report/
