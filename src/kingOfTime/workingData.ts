import { formatDate, json2csv } from "../utils";
import { doFetch } from "../accessKingOfTime";

/**
 * start: 50日前を yyyy-MM-dd形式
 * end: 前日を yyyy-MM-dd形式
 * @returns
 */
export function getWorkingTerm(): { start: string; end: string } {
  const end = new Date();
  end.setDate(end.getDate() - 1);

  const start = new Date();
  start.setDate(start.getDate() - 50);
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

export async function createAllWorkings(
  divisions: { 所属コード: string }[],
  start: string,
  end: string
) {
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
  return json2csv(allWorkings);
}

/**
 * 部署ごとの勤怠状況を取得する
 * @param divisonCode 部署コード
 * @param start 開始日
 * @param end 終了日
 * @see https://developer.kingtime.jp/#%E5%8B%A4%E6%80%A0-%E6%97%A5%E5%88%A5%E5%8B%A4%E6%80%A0%E3%83%87%E3%83%BC%E3%82%BF-get
 */
export async function fetchWorkingData(
  divisonCode: string,
  start: string,
  end: string
) {
  const url = `https://api.kingtime.jp/v1.0/daily-workings?division=${divisonCode}&start=${start}&end=${end}&additionalFields=currentDateEmployee`;
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
      const employeeName =
        dw.currentDateEmployee.lastName + dw.currentDateEmployee.firstName;
      const workPlaceDivisionCode = dw.workPlaceDivisionCode;
      const workPlaceDivisionName = dw.workPlaceDivisionName;
      const overtime = dw.overtime;
      const totalWork = dw.totalWork;
      const shukkinFlg = totalWork > 0 || (!!overtime && overtime > 0) ? 1 : 0;
      const errorText = dw.isError ? "エラー" : "";

      ret.push({
        日付: date,
        雇用者キー: employeeKey,
        社員名: employeeName,
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
