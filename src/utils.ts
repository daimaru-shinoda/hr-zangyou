import { load } from "ts-dotenv";

/**
 * 環境変数を読み込む
 */
export const env = load({
  STRAWBERRY_JSON: String,
  MAIL_JSON: String,
  IS_TEST: String,
});

/**
 * REINS用設定
 */
type STRAWBERRY_JSON = {
  id: string;
  password: string;
};

export type MAIL_JSON = {
  user: string;
  pass: string;
};

/**
 * 環境設定名
 */
enum JSON_ENV_NAME {
  STRAWBERRY = "STRAWBERRY_JSON",
  MAIL = "MAIL_JSON",
}

/**
 * ANDPAD用設定JSONを読み込む
 */
export function loadJsonStrawberry(): STRAWBERRY_JSON {
  return loadJson(JSON_ENV_NAME.STRAWBERRY) as STRAWBERRY_JSON;
}

/**
 * ANDPAD用設定JSONを読み込む
 */
export function loadJsonMail(): MAIL_JSON {
  return loadJson(JSON_ENV_NAME.MAIL) as MAIL_JSON;
}

/**
 * 環境変数名を指定してJSONを読み込む
 * @param envName 環境変数名
 */
function loadJson(envName: JSON_ENV_NAME): STRAWBERRY_JSON | MAIL_JSON {
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

/**
 * テスト中か確認する
 * @returns true: テスト中 / false: 本番
 */
function isTest() {
  return env.IS_TEST === "true";
}
export const IS_TEST = isTest();

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

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${pad0(month)}-${pad0(day)}`;
}
