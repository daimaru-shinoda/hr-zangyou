import { chromium } from "playwright-core";
import { execDL } from "./strawberry-jam";
import { sleep, IS_TEST } from "./utils";

(async () => {
  console.log("program start!");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: !IS_TEST,
    args: [
      "--no-sandbox",
      "--mute-audio",
      "--no-default-browser-check",
      "--no-first-run",
      "--disable-cache",
    ],
  }); // Or 'firefox' or 'webkit'.
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.133 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    await execDL(page);
  } catch (e) {
    console.debug(e);
    await sleep(10);
  } finally {
    await page.close();
    await browser.close();
  }
})();
