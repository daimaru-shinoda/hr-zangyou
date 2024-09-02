import { load } from "ts-dotenv";

/**
 * 環境変数を読み込む
 */
export const env = load({
  ACCESS_TOKEN: String,
  IS_TEST: String,
  GAS_URL: String,
  GAS_API_KEY: String,
});

/**
 * 環境設定名
 */
enum JSON_ENV_NAME {
  ACCESS_TOKEN = "ACCESS_TOKEN",
}

/**
 * テスト中か確認する
 * @returns true: テスト中 / false: 本番
 */
function isTest() {
  return env.IS_TEST === "true";
}
export const IS_TEST = isTest();

export const ACCESS_TOKEN = env.ACCESS_TOKEN;

/**
 * GASのURLとAPIキーを取得する
 * @returns { url: GASのURL, apiKey: APIキー }
 */
export function getGASInfo() {
  const url = env.GAS_URL;
  const apiKey = env.GAS_API_KEY;
  if (!url || !apiKey) {
    throw new Error("GASのURLかAPIキーが設定されていません");
  }
  return { url, apiKey };
}

/**
 * スリープする
 * @param seconds 秒数
 */
export function sleep(seconds: number) {
  const sec = seconds - 1 + Math.random();
  return new Promise((r) => setTimeout(r, sec * 1000));
}

/**
 * 先頭0埋めする
 * @param n
 * @param count
 * @returns 0埋めされた文字列
 */
export function pad0(n: number, count: number = 2) {
  return `${n}`.padStart(count, "0");
}

/**
 * 指定された日付の年月を取得する
 * @returns yyyy-MM形式の年月
 */
export function formatYM(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${pad0(month)}`;
}

/**
 * 指定された日付の年月日を取得する
 * @param date
 * @returns yyyy-MM-dd形式の年月日
 */
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${pad0(month)}-${pad0(day)}`;
}

/**
 * 指定された日付の年月日時分を取得する
 * @param date
 * @returns yyyy-MM-dd HH:mm形式の年月日時分
 */
export function formatTime(date: Date) {
  const dateStr = formatDate(date);
  const hour = date.getHours();
  const minutes = date.getMinutes();

  return `${dateStr} ${pad0(hour)}:${pad0(minutes)}`;
}

/**
 * JSONをCSV形式に変換する
 * @param json
 * @returns CSV形式の文字列
 */
export function json2csv(json: any[]) {
  if (json.length === 0) return "";

  const keys: string[] = [];
  for (const row of json) {
    const rowKeys = Object.keys(row);
    for (const rowKey of rowKeys) {
      if (!keys.includes(rowKey)) {
        keys.push(rowKey);
      }
    }
  }

  const header = keys.join(",") + "\n";
  const body = json
    .map((row) => keys.map((key) => row[key]).join(","))
    .join("\n");
  return header + body;
}

/**
 * 配列の合計を求める
 * @param nums
 * @returns 合計値
 */
export function sum(nums: number[]) {
  let i = 0;
  for (const num of nums) i += num;
  return i;
}
