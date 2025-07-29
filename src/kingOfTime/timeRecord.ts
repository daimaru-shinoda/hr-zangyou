import { formatTime } from "../utils";
import { doFetch } from "../accessKingOfTime";

/**
 * 日別打刻データを取得する
 * @param startDate 対象日
 * @param division 部署コード
 */
export async function fetchTimerecord(
  division: string,
  start: string,
  end: string
) {
  const url = `https://api.kingtime.jp/v1.0/daily-workings/timerecord?division=${division}&ondivision=true&start=${start}&end=${end}&additionalFields=currentDateEmployee`;
  return parseTimeRecordJson(await doFetch(url), division);
}

/**
 * 打刻忘れをチェックし、忘れている場合は配列にする
 * @param json
 * @see https://developer.kingtime.jp/#%E5%8B%A4%E6%80%A0-%E5%B9%B4%E5%88%A5%E4%BC%91%E6%9A%87%E3%83%87%E3%83%BC%E3%82%BF
 */
export function parseTimeRecordJson(array: any[], division: string) {
  const lackingData = [];
  const allData = [];
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
      const startStr = formatTime(start);
      const endStr = formatTime(end);

      const data = {
        日付: date,
        勤務開始: startStr,
        勤務終了: endStr,
        社員名: name,
        社員タイプ: typeName,
        社員コード: employeeKey,
        所属コード: division,
      };

      allData.push(data);

      if (!!startStr && !!endStr) continue; // 出勤退勤が両方ある場合は除外

      lackingData.push(data);
    }
  }
  return { lackingData, allData };
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
