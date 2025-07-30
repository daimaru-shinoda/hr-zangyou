import { fetchDivisions } from "./kingOfTime/divisions";
import { fetchEmployee } from "./kingOfTime/employee";
import {
  createAllWorkings,
  fetchWorkingData,
  getWorkingTerm,
} from "./kingOfTime/workingData";
import { createHolidays } from "./kingOfTime/holidays";
import { createTimeRecordJson } from "./kingOfTime/requestTimerecord";
import { ACCESS_TOKEN, formatDate, getGASInfo, json2csv } from "./utils";
import { writeFile } from "fs/promises";

/**
 * king of time の利用可能時間か確認する
 * @returns
 */
function checkHour() {
  const today = new Date();
  const hour = today.getHours();
  const minutes = today.getMinutes();
  const value = hour * 100 + minutes;
  if (850 <= value && value <= 1000) return false;
  if (1730 <= value && value <= 1830) return false;
  return true;
}

export async function getAllWorkingData() {
  if (!checkHour()) return console.log("利用可能時間外です");

  const divisions = await fetchDivisions();
  const terms = getAllTerms();

  const ret = [];
  for (const divison of divisions) {
    for (const { start, end } of terms) {
      const dailyWorkings = await fetchWorkingData(
        divison.所属コード,
        start,
        end
      );
      ret.push(...dailyWorkings);
    }
  }

  const csvStr = json2csv(ret);

  await writeFile("allWorkings.csv", csvStr);
  // await postCsv("allWorkings", csvStr);
}

/**
 * 勤怠データダウンロード開始しGASサーバへアップロードする
 * @returns true 成功
 */
export async function doDl() {
  if (!checkHour()) return console.log("利用可能時間外です");

  const divisions = await fetchDivisions();
  console.log(divisions);
  await postCsv("divisions", json2csv(divisions));

  // 修正申請リストを取得する
  const { lackingRecord, allTimerecord } = await createTimeRecordJson(
    divisions
  );
  await postCsv("lackingRecord", lackingRecord);
  await postCsv("allTimeRecord", allTimerecord);

  const employees = await fetchEmployee();
  await postCsv("employees", json2csv(employees));

  const { start, end } = getWorkingTerm();
  const allWorkings = await createAllWorkings(divisions, start, end);
  await postCsv("allWorkings", allWorkings);

  const employeeTypeCodeList = getEmployeeTypeCodeList(employees);
  const { allHolidays, yoteiHolidays } = await createHolidays(
    employeeTypeCodeList
  );
  await postCsv("yoteiHolidays", yoteiHolidays);
  await postCsv("allHolidays", allHolidays);

  return true;
}

/**
 * CSVをGASサーバーへアップロードする
 * @param csvname
 * @param csvStr
 */
async function postCsv(csvname: string, csvStr: string) {
  if (!csvStr) return console.log("csvStr is empty", csvname);
  const { url, apiKey } = getGASInfo();
  const body = JSON.stringify({
    csvname,
    target: "大丸開発",
    csvStr,
    apiKey,
  });
  const options = {
    method: "post",
    body,
  };
  await fetch(url, options);
}

/**
 *
 * @returns 期間リスト
 */
function getAllTerms() {
  const current = new Date(2024, 9, 1);
  const now = new Date();
  const array = [];
  while (current.getTime() < now.getTime()) {
    const currentLast = new Date(current.getTime());
    currentLast.setMonth(current.getMonth() + 1, 0); // 当月末尾を指定する
    array.push({
      start: formatDate(current),
      end: formatDate(currentLast),
    });
    current.setMonth(current.getMonth() + 1, 1);
  }
  console.log("getAllTerms", array);
  return array;
}

/**
 * 開始日と終了日を取得する
 * @returns
 */
export function getTerm() {
  const today = new Date().getDate();
  const startDate = new Date(); // 22日以降は前月の21日から取得する
  if (today < 22) {
    startDate.setMonth(startDate.getMonth() - 1);
  }
  startDate.setDate(21);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1); // 昨日までのデータを取得する
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return { start, end };
}

/**
 * 年度を取得する
 * @returns
 */
export function getNendo() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  return month < 4 ? year - 1 : year;
}

/**
 * 社員リストから社員タイプコードを取得する
 * @param employees
 * @returns
 */
function getEmployeeTypeCodeList(employees: { 社員タイプコード: string }[]) {
  const ret: string[] = [];
  for (const employee of employees) {
    if (!ret.includes(employee.社員タイプコード)) {
      ret.push(employee.社員タイプコード);
    }
  }
  return ret;
}

/**
 * urlからjsonをgetする
 * @param url
 * @returns jsonデータ
 * @see ACCESS_TOKEN
 */
export async function doFetch(url: string) {
  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  const result = await fetch(url, {
    headers,
  });
  if (result.status === 400)
    console.error("doFetch error", url, result.status, await result.text());
  if (result.status !== 200) {
    console.error(result.status, result.statusText);
    return [];
  }
  return await result.json();
}
