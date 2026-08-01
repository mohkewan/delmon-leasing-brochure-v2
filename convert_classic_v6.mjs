import puppeteer from 'puppeteer-core';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROMIUM = '/usr/bin/chromium';
const INPUT_DIR = '/tmp/classic_v6';
const OUTPUT_DIR = '/tmp/classic_v6_pdf';

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROMIUM,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu'],
  headless: true,
});

const pages = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.html')).sort();

for (const htmlFile of pages) {
  const htmlPath = path.join(INPUT_DIR, htmlFile);
  const pdfPath = path.join(OUTPUT_DIR, htmlFile.replace('.html', '.pdf'));
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1122, height: 794 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));
  
  await page.pdf({
    path: pdfPath,
    width: '297mm',
    height: '210mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  
  await page.close();
  console.log(`تم: ${pdfPath}`);
}

await browser.close();
console.log('\nجميع الصفحات تحولت بنجاح!');
