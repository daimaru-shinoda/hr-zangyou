import { Page } from "playwright-core";
import { sleep, loadJsonStrawberry } from "./utils";
import { sendMail } from "./mail";
import { rm } from "fs/promises";

const LOGIN_URL = "http://52.192.132.89:44096/stjamweb/index.jsp";

const SHUUKEI_KENSAKU_URL =
  "http://52.192.132.89:44096/stjamweb/StockStatistics/StockStatistics_Input.jsp";

const SHUUKEI_KEKKA_URL =
  "http://52.192.132.89:44096/stjamweb/StockStatistics/StockStatistics_Output.jsp";

export async function execDL(page: Page) {
  await login(page, LOGIN_URL);
  console.debug("login finished");
  await download(page);
  console.debug("click download finished");
}

/**
 * playwright: 入力時のオプションを作成する
 */
function createFillOption() {
  return {
    timeout: 1000,
  };
}

/**
 * playwright: クリック時のオプションを作成する
 */
function createClickOption(): {
  button: "left";
  delay: number;
  position: { x: number; y: number };
  clickCount: number;
} {
  return {
    button: "left",
    delay: 500 * Math.random() + 10,
    clickCount: 1,
    position: { x: 5 * Math.random() + 1, y: 5 * Math.random() + 1 },
  };
}

/**
 * ストロベリージャムにログインする
 * @param page
 */
async function login(page: Page, url: string) {
  console.debug("login start");

  await page.goto(url);

  console.debug("login page opened");

  const STRAWBERRY_JSON = loadJsonStrawberry();

  // username入力
  await page
    .locator("input#username")
    .fill(STRAWBERRY_JSON.id, createFillOption());
  console.debug("password input");

  // パスワードを入力
  await page
    .locator("input#password")
    .fill(STRAWBERRY_JSON.password, createFillOption());

  await sleep(3);

  // ログインボタンクリック
  await page.locator("input#btnsubmit").click(createClickOption());

  // 出力画面を待つ
  await page.waitForURL(url);

  await sleep(2);
}

async function download(page: Page) {
  const shuukeiLink = page.locator("div#content a.btnmenu", {
    hasText: "在庫集計",
  });
  await shuukeiLink.click(createClickOption());
  await page.waitForURL(SHUUKEI_KENSAKU_URL);
  await sleep(3);

  await page.locator(`input#bStatistic`).click(createClickOption());
  await page.waitForURL(SHUUKEI_KEKKA_URL);
  await sleep(3);

  await page.locator("input[value=書き出し]").click(createClickOption());
  await page.waitForSelector("#ui-id-1");
  await page.locator("#btnAddAllExport").click(createClickOption());

  const downloadPromise = page.waitForEvent("download", {
    timeout: 60 * 1000,
  });
  await page.locator(`input#btnexcel`).click(createClickOption());

  const download = await downloadPromise;
  const downloadPath = await download.path();

  await sendMail(downloadPath);

  await sleep(2);

  await rm(downloadPath);
}
