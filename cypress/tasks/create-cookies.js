import { executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import fse from 'fs-extra';

dotenv.config({ path: `.env.${process.env.ENV}` });
puppeteer.use(StealthPlugin());

async function saveCookiesToFile(email, password, baseUrl) {
  await puppeteer
    .launch({
      headless: true,
      executablePath: executablePath(),
      args: [
        '--no-sandbox',
        '--disable-gpu',
        '--enable-webgl',
        '--window-size=1920,1080',
      ],
    })
    .then(async (browser) => {
      const page = await browser.newPage();
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });

      await page.waitForSelector('[role="button"]', { visible: true });
      await page.click('[role="button"]');

      await page.waitForSelector('[type="email"]', { visible: true });
      await page.type('[type="email"]', email);
      await page.keyboard.press('Enter');

      await page.waitForSelector('[type="password"]', { visible: true });
      await page.type('[type="password"]', password);
      await page.keyboard.press('Enter');

      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      const cookies = await page.cookies();
      await fse.writeJSON(
        `cypress/fixtures/${process.env.COOKIES}-cookies.json`,
        cookies,
        { spaces: 2 }
      );

      await browser.close();
    });
}

saveCookiesToFile(
  process.env.GOOGLE_USER,
  process.env.GOOGLE_PWD,
  process.env.BASE_URL
);
