import { Page } from "playwright-core";
import { sleep, loadJsonStrawberry, pad0, formatDate } from "./utils";
import { sendMail } from "./mail";
import { rm } from "fs/promises";
import { join } from "path";
import { cwd } from "process";

import ExcelJS from "exceljs";

const LOGIN_URL = "http://52.192.132.89:44096/stjamweb/index.jsp";

const SHUUKEI_KENSAKU_URL =
  "http://52.192.132.89:44096/stjamweb/StockStatistics/StockStatistics_Input.jsp";

const SHUUKEI_KEKKA_URL =
  "http://52.192.132.89:44096/stjamweb/StockStatistics/StockStatistics_Output.jsp";

export async function execDL(page: Page) {
  await login(page, LOGIN_URL);
  console.debug("login finished");
  const itemCodes = [1, 2, 4, 5, 6, 9, 10, 11, 12, 13, 15, 16, 17];
  const workbook = new ExcelJS.Workbook();
  workbook.title = `商品在庫`;

  for (const itemCode of itemCodes) {
    const fileInfo = await download(page, pad0(itemCode, 3));
    if (!fileInfo) continue;
    const newSheet = workbook.addWorksheet(fileInfo.sheetName);
    const downloadedXlsx = new ExcelJS.Workbook();
    await downloadedXlsx.xlsx.readFile(fileInfo.path);
    const dataSheet = downloadedXlsx.worksheets[0];
    for (let i = 1; i <= dataSheet.actualRowCount; i++) {
      const dataRow = dataSheet.getRow(i);
      const newRow = newSheet.getRow(i);

      for (let j = 1; j <= dataSheet.actualColumnCount; j++) {
        newRow.getCell(j).value = dataRow.getCell(j).value;
      }
    }
    await rm(fileInfo.path);
  }

  const filename = `${formatDate(new Date())}-商品在庫.xlsx`;
  const outputPath = join(cwd(), filename);
  await workbook.xlsx.writeFile(outputPath);

  await sendMail([{ path: outputPath, filename }]);

  await sleep(2);

  await rm(outputPath);
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

async function download(page: Page, itemCode: string) {
  console.info({ itemCode });
  const shuukeiLink = page.locator("div#content a.btnmenu", {
    hasText: "在庫集計",
  });
  await shuukeiLink.click(createClickOption());
  await page.waitForURL(SHUUKEI_KENSAKU_URL);
  await sleep(5);

  await page.locator("#vsItemCode1").fill(itemCode, createFillOption());
  await page.keyboard.press("Tab");
  await sleep(5);
  const itemName = await page.locator("#vsItemName1").inputValue();
  if (!itemName) throw new Error(`${itemCode}の名前が取得できませんでした。`);

  await page.locator(`input#bStatistic`).click(createClickOption());
  await page.waitForURL(SHUUKEI_KEKKA_URL);
  await sleep(5);

  const itemCount = await page
    .locator("td[dir=ltr] span#sp_1_page")
    .innerText();
  // アイテムがない場合は飛ばす
  if (itemCount === "0") {
    await page.locator("div.page_header_line a.backmenu").click();
    await sleep(5);
    return null;
  }
  await page.locator("input[value=書き出し]").click(createClickOption());
  await page.waitForSelector("#ui-id-1");
  await page.locator("#btnAddAllExport").click(createClickOption());

  const downloadPromise = page.waitForEvent("download", {
    timeout: 60 * 1000,
  });
  await page.locator(`input#btnexcel`).click(createClickOption());

  const download = await downloadPromise;
  const downloadPath = await download.path();

  const sheetName = `${itemCode}-${itemName.replace(/[◆◎●]/g, "")}`;

  await page.locator("div.page_header_line a.backmenu").click();
  await sleep(5);

  return { sheetName: sheetName, path: downloadPath };
}
