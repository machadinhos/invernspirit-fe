/* eslint-disable no-console */
import AxePuppeteer from '@axe-core/puppeteer';
import puppeteer from 'puppeteer';

const host = 'http://localhost:5173';
const countryCodes = ['/es'];
const pagesToTest = [
  '/',
  '/about',
  '/contact',
  '/shop/collections',
  '/shop/products',
  '/cart',
  '/sign-in',
  '/sign-up',
  '/checkout',
];

const browser = await puppeteer.launch();
const page = await browser.newPage();

let totalViolations = 0;

for (const path of pagesToTest) {
  for (const countryCode of countryCodes) {
    const url = `${host}${countryCode}${path}`;
    console.log(`\n🔍 Testing ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle0' });

    const results = await new AxePuppeteer(page).analyze();

    if (results.violations.length > 0) {
      totalViolations += results.violations.length;
      console.log(`🚨 Accessibility violations found:`);
      results.violations.forEach((violation) => {
        console.log(`\n- ${violation.id}: ${violation.description}`);
        violation.nodes.forEach((node, index) => {
          console.log(`  ${index + 1}. HTML Element: ${node.html}`);
          console.log(`     Failure Summary: ${node.failureSummary}`);
        });
      });
    } else {
      console.log(`✅ No accessibility violations found.`);
    }
  }
}

await browser.close();

console.log('\n✅ Accessibility audit completed.');
console.log('Found accessibility violations:', totalViolations);

process.exit(totalViolations > 0 ? 1 : 0);
