# Run Locally
npm ci
npx playwright test --headed
npx playwright show-report

# Run in Docker
docker build -t origin-playwright-tests .
docker run --rm -v $(pwd)/test-results:/app/test-results origin-playwright-tests

# Test Artifacts

PDF downloads → test-results/

HTML report → playwright-report/