import { doFetch, getNendo } from "../accessKingOfTime";
import { formatDate, json2csv, sum } from "../utils";
import Decimal from "decimal.js";

export async function createHolidays(employeeTypeCodeList: string[]) {
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
  return {
    yoteiHolidays: json2csv(allYoteiHolidays),
    allHolidays: json2csv(allHolidays),
  };
}

/**
 * 休暇取得状況を取得する
 * @param employeeTypeCode
 * @param year
 * @returns
 * @see https://developer.kingoftime.jp/#%E5%8B%A4%E6%80%A0-%E5%B9%B4%E5%88%A5%E4%BC%91%E6%9A%87%E3%83%87%E3%83%BC%E3%82%BF
 */
export async function fetchHolidays(employeeTypeCode: string, year: number) {
  const url = `https://api.kingtime.jp/v1.0/yearly-workings/holidays/${employeeTypeCode}/${year}?additionalFields=currentDateEmployee`;
  return parseHolidayDataJson(await doFetch(url));
}

/**
 * 休暇データを配列に変える
 * @param json
 * @returns
 */
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
    employeeData["社員名"] =
      employee.currentDateEmployee.lastName +
      employee.currentDateEmployee.firstName;

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
              氏名: employeeData["社員名"],
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
