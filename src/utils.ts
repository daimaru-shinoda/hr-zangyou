import { load } from "ts-dotenv";

/**
 * 環境変数を読み込む
 */
export const env = load({
  ACCESS_TOKEN: String,
  MAIL_JSON: String,
  IS_TEST: String,
  GAS_URL: String,
  GAS_API_KEY: String,
});

export type MAIL_JSON = {
  user: string;
  pass: string;
};

/**
 * 環境設定名
 */
enum JSON_ENV_NAME {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  MAIL = "MAIL_JSON",
}

/**
 * MAIL用設定JSONを読み込む
 */
export function loadJsonMail(): MAIL_JSON {
  return loadJson(JSON_ENV_NAME.MAIL) as MAIL_JSON;
}

/**
 * 環境変数名を指定してJSONを読み込む
 * @param envName 環境変数名
 */
function loadJson(envName: JSON_ENV_NAME): MAIL_JSON {
  const content = env[envName];
  if (!content) throw new Error(`環境変数が設定されてません ${envName}`);
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("環境変数から取得したjsonのパースに失敗しました。", {
      content,
    });
    throw e;
  }
}

export function getGASInfo() {
  const url = env.GAS_URL;
  const apiKey = env.GAS_API_KEY;
  if (!url || !apiKey) {
    throw new Error("GASのURLかAPIキーが設定されていません");
  }
  return { url, apiKey };
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
 * スリープする
 * @param seconds 秒数
 */
export function sleep(seconds: number) {
  const sec = seconds - 1 + Math.random();
  return new Promise((r) => setTimeout(r, sec * 1000));
}

export function pad0(n: number, count: number = 2) {
  const nStr = `${n}`;
  const length = count - nStr.length;
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(0);
  }
  array.push(n);
  return array.join("");
}

export function formatYM(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${pad0(month)}`;
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${pad0(month)}-${pad0(day)}`;
}

export function formatTime(date: Date) {
  const dateStr = formatDate(date);
  const hour = date.getHours();
  const minutes = date.getMinutes();

  return `${dateStr} ${pad0(hour)}:${pad0(minutes)}`;
}

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

export function sum(nums: number[]) {
  let i = 0;
  for (const num of nums) i += num;
  return i;
}
