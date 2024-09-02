import { writeFile, rm } from "fs/promises";
import {
  ACCESS_TOKEN,
  formatDate,
  formatTime,
  formatYM,
  getGASInfo,
  json2csv,
  sum,
} from "./utils";
import Decimal from "decimal.js";
import { env } from "process";

const DIVISION_FILE_NAME = "./tmp/divisions.csv";
const EMPLOYEE_FILE_NAME = "./tmp/employees.csv";
const ALL_WORKINGS_FILE_NAME = "./tmp/allWorkings.csv";
const ALL_HOLIDAYS_FILE_NAME = "./tmp/allHolidays.csv";
const YOTEI_HOLIDAYS_FILE_NAME = "./tmp/yoteiHolidays.csv";
const TIME_RECORD_FILE_NAME = "./tmp/timeRecord.csv";
export const FILE_PATHS = [
  DIVISION_FILE_NAME,
  EMPLOYEE_FILE_NAME,
  ALL_WORKINGS_FILE_NAME,
  ALL_HOLIDAYS_FILE_NAME,
  YOTEI_HOLIDAYS_FILE_NAME,
  TIME_RECORD_FILE_NAME,
];

export async function clearFiles() {
  for (const filePath of FILE_PATHS) {
    try {
      await rm(filePath);
    } catch {
      // do nothing
    }
  }
}

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

/**
 * ダウンロード開始する
 * @returns true 成功
 */
// export async function doDl() {
//   if (!checkHour()) return console.log("利用可能時間外です");

//   await clearFiles();
//   const divisions = await fetchDivisions();
//   await writeFile(DIVISION_FILE_NAME, json2csv(divisions));

//   const requestArray = await fetchRequestTimerecord();

//   const records = [];
//   const { start, end } = getTerm();
//   console.log({ start, end });
//   for (const division of divisions) {
//     const timeRecords = await fetchTimerecord(division.所属コード, start, end);
//     const filtered = timeRecords.filter((record) => {
//       for (const request of requestArray) {
//         if (record.社員コード !== request.社員コード) continue;
//         if (record.日付 !== request.日付) continue;
//         return false;
//       }
//       return true;
//     });
//     records.push(...filtered);
//   }
//   await writeFile(TIME_RECORD_FILE_NAME, json2csv(records));

//   const employees = await fetchEmployee();
//   await writeFile(EMPLOYEE_FILE_NAME, json2csv(employees));
//   let allWorkings: any[] = [];
//   for (const divison of divisions) {
//     const dailyWorkings = await fetchWorkingData(
//       divison.所属コード,
//       start,
//       end
//     );
//     allWorkings = allWorkings.concat(dailyWorkings);
//   }
//   await writeFile(ALL_WORKINGS_FILE_NAME, json2csv(allWorkings));
//   const employeeTypeCodeList = getEmployeeTypeCodeList(employees);
//   let allHolidays: any[] = [];
//   let allYoteiHolidays: any[] = [];
//   const nendo = getNendo();
//   for (const employeeTypeCode of employeeTypeCodeList) {
//     const { holidays, yoteiHolidays } = await fetchHolidays(
//       employeeTypeCode,
//       nendo
//     );
//     allHolidays.push(...holidays);
//     allYoteiHolidays.push(...yoteiHolidays);
//   }
//   await writeFile(YOTEI_HOLIDAYS_FILE_NAME, json2csv(allYoteiHolidays));
//   await writeFile(ALL_HOLIDAYS_FILE_NAME, json2csv(allHolidays));

//   return true;
// }

export async function doDl() {
  if (!checkHour()) return console.log("利用可能時間外です");

  const divisions = await fetchDivisions();
  await postCsv("divisions", json2csv(divisions));

  const requestArray = await fetchRequestTimerecord();

  const records = [];
  const { start, end } = getTerm();
  console.log({ start, end });
  {
    for (const division of divisions) {
      const timeRecords = await fetchTimerecord(
        division.所属コード,
        start,
        end
      );
      const filtered = timeRecords.filter((record) => {
        for (const request of requestArray) {
          if (record.社員コード !== request.社員コード) continue;
          if (record.日付 !== request.日付) continue;
          return false;
        }
        return true;
      });
      records.push(...filtered);
    }
    await postCsv("timerecord", json2csv(records));
  }

  const employees = await fetchEmployee();
  await postCsv("employees", json2csv(employees));

  {
    const allWorkings = [];
    for (const divison of divisions) {
      const dailyWorkings = await fetchWorkingData(
        divison.所属コード,
        start,
        end
      );
      allWorkings.push(...dailyWorkings);
    }
    allWorkings.sort((a, b) => {
      if (a.日付 > b.日付) return 1;
      if (a.日付 < b.日付) return -1;
      return 0;
    });
    await postCsv("allWorkings", json2csv(allWorkings));
  }

  {
    const employeeTypeCodeList = getEmployeeTypeCodeList(employees);
    let allHolidays: any[] = [];
    let allYoteiHolidays: any[] = [];
    const nendo = getNendo();
    for (const employeeTypeCode of employeeTypeCodeList) {
      const { holidays, yoteiHolidays } = await fetchHolidays(
        employeeTypeCode,
        nendo
      );
      allHolidays.push(...holidays);
      allYoteiHolidays.push(...yoteiHolidays);
    }
    await postCsv("yoteiHolidays", json2csv(allYoteiHolidays));
    await postCsv("allHolidays", json2csv(allHolidays));
  }

  return true;
}

/**
 * CSVをアップロードする
 * @param csvname
 * @param csvStr
 */
async function postCsv(csvname: string, csvStr: string) {
  if (!csvStr) return console.log("csvStr is empty", csvname);
  const { url, apiKey } = getGASInfo();
  const body = JSON.stringify({
    csvStr,
    csvname,
    apiKey,
    target: "大丸開発",
  });
  const options = {
    method: "post",
    body,
  };
  await fetch(url, options);
}

export function getTerm() {
  const today = new Date().getDate();
  const startDate = new Date();
  if (today < 22) {
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setDate(21);
  } else {
    startDate.setDate(21);
  }
  const endDate = new Date(
    startDate.getFullYear(),
    today < 22 ? startDate.getMonth() + 1 : startDate.getMonth(),
    today - 1
  );
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return { start, end };
}

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

async function doFetch(url: string) {
  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  const result = await fetch(url, {
    headers,
  });
  if (result.status !== 200) return [];
  return await result.json();
}

/**
 * 部署を取得する
 */
async function fetchDivisions() {
  const divisionURL = `https://api.kingtime.jp/v1.0/divisions`;
  return parseDivisionsJson(await doFetch(divisionURL));
}

/**
 * 部署jsonを配列に変える
 * @param json
 * @see https://developer.kingtime.jp/#%E5%BE%93%E6%A5%AD%E5%93%A1-%E6%89%80%E5%B1%9E%E3%83%87%E3%83%BC%E3%82%BF-get
 */
export function parseDivisionsJson(json: any[]) {
  const ret = [];
  for (const { code, name, dayBorderTime } of json) {
    ret.push({
      所属コード: code,
      所属名: name,
      // 日付境界時間: dayBorderTime,
    });
  }
  return ret;
}

/**
 * 社員を取得する
 * @see https://developer.kingtime.jp/#%E5%BE%93%E6%A5%AD%E5%93%A1-%E5%BE%93%E6%A5%AD%E5%93%A1%E3%83%87%E3%83%BC%E3%82%BF-get
 */
async function fetchEmployee() {
  const employeeURL = `https://api.kingtime.jp/v1.0/employees?includeResigner=true&additionalFields=resignationDate`;
  return parseEmployeeJson(await doFetch(employeeURL));
}
/**
 * 社員jsonを配列に変える
 * @param json
 * @see https://developer.kingtime.jp/#%E5%BE%93%E6%A5%AD%E5%93%A1-%E6%89%80%E5%B1%9E%E3%83%87%E3%83%BC%E3%82%BF-get
 */
export function parseEmployeeJson(json: any[]) {
  if (!json) return [];

  const ret = [];
  for (const {
    typeCode,
    typeName,
    lastName,
    firstName,
    key,
    divisionCode,
    resignationDate,
  } of json) {
    ret.push({
      社員キー: key,
      社員名: lastName + firstName,
      所属コード: divisionCode,
      社員タイプコード: typeCode,
      社員タイプ: typeName,
      退職日: resignationDate,
    });
  }
  return ret;
}

/**
 * 部署ごとの勤怠状況を取得する
 * @param divisonCode 部署コード
 * @param start 開始日
 * @param end 終了日
 * @see https://developer.kingtime.jp/#%E5%8B%A4%E6%80%A0-%E6%97%A5%E5%88%A5%E5%8B%A4%E6%80%A0%E3%83%87%E3%83%BC%E3%82%BF-get
 */
async function fetchWorkingData(
  divisonCode: string,
  start: string,
  end: string
) {
  const url = `https://api.kingtime.jp/v1.0/daily-workings?division=${divisonCode}&start=${start}&end=${end}`;
  return parseWorkingDataJson(await doFetch(url));
}

/**
 * 勤怠データjsonを配列に変える
 * @param json
 * @returns
 * @see https://developer.kingtime.jp/#%E5%8B%A4%E6%80%A0-%E6%97%A5%E5%88%A5%E5%8B%A4%E6%80%A0%E3%83%87%E3%83%BC%E3%82%BF-get-1
 */
export function parseWorkingDataJson(json: any[]) {
  if (!json) return [];
  const ret = [];
  for (const { dailyWorkings } of json) {
    for (const dw of dailyWorkings) {
      const date = dw.date;
      const employeeKey = dw.employeeKey;
      const workPlaceDivisionCode = dw.workPlaceDivisionCode;
      const workPlaceDivisionName = dw.workPlaceDivisionName;
      const overtime = dw.overtime;
      const totalWork = dw.totalWork;
      const shukkinFlg = totalWork > 0 || (!!overtime && overtime > 0) ? 1 : 0;
      const errorText = dw.isError ? "エラー" : "";

      ret.push({
        日付: date,
        雇用者キー: employeeKey,
        所属コード: workPlaceDivisionCode,
        所属名: workPlaceDivisionName,
        残業時間: overtime,
        合計勤務時間: totalWork,
        出勤フラグ: shukkinFlg,
        エラー: errorText,
      });
    }
  }
  return ret;
}

/**
 * 休暇取得状況を取得する
 * @param employeeTypeCode
 * @param year
 * @returns
 */
async function fetchHolidays(employeeTypeCode: string, year: number) {
  const url = `https://api.kingtime.jp/v1.0/yearly-workings/holidays/${employeeTypeCode}/${year}`;
  return parseHolidayDataJson(await doFetch(url));
}

export function parseHolidayDataJson(json: any) {
  const holidays: any[] = [];
  const yoteiHolidays: any[] = [];
  const ret = { holidays, yoteiHolidays };
  if (!json || !json.employees) return ret;
  const today = formatDate(new Date());
  const employees = json.employees;
  const year = json.year;
  for (const employee of employees) {
    const employeeData: any = {};
    employeeData["年度"] = year;
    employeeData["雇用者キー"] = employee.employeeKey;

    const employHolidays = employee.holidays;
    for (const holiday of employHolidays) {
      const holidayName = holiday.name;
      const holidayCode = holiday.code;

      let usedDays = new Decimal("0");
      let usedDaysIncludeFuture = new Decimal("0");
      let usedMiniutes = new Decimal("0");
      let usedMiniutesIncludeFuture = new Decimal("0");
      const obtained = holiday.obtained;
      if (!!obtained) {
        for (const { date, days, minutes } of obtained) {
          if (date >= today) {
            yoteiHolidays.push({
              雇用者キー: employee.employeeKey,
              休暇コード: holidayCode,
              休暇タイプ: holidayName,
              休暇取得日: date,
              休暇取得日数: days,
              休暇取得時間: minutes,
            });
          }
          if (days) {
            if (date <= today) usedDays = usedDays.plus(days);
            usedDaysIncludeFuture = usedDaysIncludeFuture.plus(days);
          }
          if (minutes) {
            if (date <= today) usedMiniutes = usedMiniutes.plus(minutes);
            usedMiniutesIncludeFuture = usedMiniutesIncludeFuture.plus(minutes);
          }
        }
      }
      employeeData[`休暇コード-${holidayCode}`] = holidayCode;
      employeeData[`休暇タイプ-${holidayCode}`] = holidayName;
      employeeData[`${holidayName}取得日数(日)`] = usedDays.toNumber();
      employeeData[`${holidayName}取得日数(日)予定込み`] =
        usedDaysIncludeFuture.toNumber();
      employeeData[`${holidayName}取得時間(分)`] = usedMiniutes.toNumber();
      employeeData[`${holidayName}取得時間(分)予定込み`] =
        usedMiniutesIncludeFuture.toNumber();
      const expired: { days: number }[] = holiday.expired;
      if (!!expired) {
        employeeData[`失効済み-${holidayName}`] = sum(
          expired.map(({ days }) => days).filter((v) => !!v)
        );
      } else {
        employeeData[`失効済み-${holidayName}`] = 0;
      }
    }
    holidays.push(employeeData);
  }
  return ret;
}

/**
 * 日別打刻データを取得する
 * @param startDate 対象日
 * @param division 部署コード
 * @returns
 */
async function fetchTimerecord(division: string, start: string, end: string) {
  const url = `https://api.kingtime.jp/v1.0/daily-workings/timerecord?division=${division}&ondivision=true&start=${start}&end=${end}&additionalFields=currentDateEmployee`;
  return parseTimerecordJson(await doFetch(url), division);
}

/**
 * 打刻データを出勤・退勤時刻に変更する
 * @param timeRecords
 * @returns
 */
function getStartAndEndFromTimeRecords(
  timeRecords: { time: string; name: string }[]
) {
  const start = timeRecords.find(({ name }) => name === "出勤")?.time;
  const end = timeRecords.find(({ name }) => name === "退勤")?.time;
  return { start, end };
}

/**
 * 打刻忘れをチェックし、忘れている場合は配列にする
 * @param json
 * @see https://developer.kingtime.jp/#%E5%8B%A4%E6%80%A0-%E5%B9%B4%E5%88%A5%E4%BC%91%E6%9A%87%E3%83%87%E3%83%BC%E3%82%BF
 */
export function parseTimerecordJson(array: any[], division: string) {
  const ret = [];
  for (const { dailyWorkings } of array) {
    for (const {
      date,
      employeeKey,
      currentDateEmployee,
      timeRecord,
    } of dailyWorkings) {
      if (!currentDateEmployee)
        throw new Error(`currentDateEmployeeが見つかりません`);
      const name = currentDateEmployee.lastName + currentDateEmployee.firstName;
      const typeName = currentDateEmployee.typeName;
      const { start, end } = getStartAndEndFromTimeRecords(timeRecord);
      const startStr = start ? formatTime(new Date(start)) : "";
      const endStr = end ? formatTime(new Date(end)) : "";

      if (!!startStr && !!endStr) continue; // 出勤退勤が両方ある場合は除外

      ret.push({
        日付: date,
        勤務開始: startStr,
        勤務終了: endStr,
        社員名: name,
        社員タイプ: typeName,
        社員コード: employeeKey,
        所属コード: division,
      });
    }
  }
  return ret;
}

/**
 * 打刻修正申請を取得する
 * @param startDate 対象日
 * @param division 部署コード
 * @returns
 */
export async function fetchRequestTimerecord() {
  const date = new Date();
  const dateArray = [formatYM(date)];
  date.setMonth(date.getMonth() - 1);
  dateArray.unshift(formatYM(date));

  const ret = [];
  for (const dateStr of dateArray) {
    const url = `https://api.kingtime.jp/v1.0/requests/timerecords/${dateStr}`;
    const result = parseRequestTimerecordJson(await doFetch(url));
    ret.push(...result);
  }
  return ret;
}

/**
 * 打刻修正申請を配列にする
 * @param json
 * @see https://developer.kingtime.jp/#%E5%8B%A4%E6%80%A0-%E5%B9%B4%E5%88%A5%E4%BC%91%E6%9A%87%E3%83%87%E3%83%BC%E3%82%BF
 */
export function parseRequestTimerecordJson(json: any) {
  if (!json.request) return [];
  const ret = [];
  for (const { date, message, status, employeeKey } of json.requests) {
    if (status !== "applying") continue; // 申請中データのみ取得する
    ret.push({
      日付: date,
      メッセージ: message,
      承認状況: status,
      社員コード: employeeKey,
    });
  }
  return ret;
}
