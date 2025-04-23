/* eslint-disable no-console */
import AxePuppeteer from '@axe-core/puppeteer';
import { findPages } from './utils/find-pages';
import puppeteer from 'puppeteer';
import type { Result } from 'axe-core';

const host = 'http://localhost:5173';
const pagesToTest = findPages();

const browser = await puppeteer.launch();

type AuditResult = {
  path: string;
  url: string;
  violations: Result[];
};

async function auditPage(path: string): Promise<AuditResult> {
  const url = `${host}/${path}`;
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  const results = await new AxePuppeteer(page).analyze();
  await page.close();

  return {
    path,
    url,
    violations: results.violations,
  };
}

console.log(`🔍 Launching audits for ${pagesToTest.length} pages…\n`);

const settled = await Promise.allSettled(pagesToTest.map(auditPage));

const successful = settled
  .filter((s) => s.status === 'fulfilled')
  .map((s: PromiseFulfilledResult<AuditResult>) => s.value)
  .sort((a, b) => a.violations.length - b.violations.length);

const errors = settled.filter((s) => s.status === 'rejected').map((s: PromiseRejectedResult) => s.reason);

let totalViolations = 0;
for (const { path, url, violations } of successful) {
  if (violations.length === 0) {
    console.log(`✅ [${path}] no violations`);
  } else {
    totalViolations += violations.length;
    console.log(`\n🚨 [${path}] ${violations.length} violations at ${url}:`);
    for (const v of violations) {
      console.log(`\n  • ${v.id}: ${v.description}`);
      v.nodes.forEach((node, i) => {
        console.log(`     ${i + 1}. <${node.html.trim()}>`);
        console.log(`        ${node.failureSummary}`);
      });
    }
  }
}

if (errors.length) {
  console.log(`\n❌ ${errors.length} pages failed to audit due to errors:`);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  errors.forEach((e: any, i) => console.log(`  ${i + 1}. ${e.stack || e}`));
}

console.log('\n✅ All audits complete.');
console.log(`Total accessibility violations: ${totalViolations}`);

process.exit(totalViolations > 0 || errors.length > 0 ? 1 : 0);
