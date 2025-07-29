import { doFetch, getTerm } from "../accessKingOfTime";
import { formatYM, json2csv } from "../utils";
import { fetchTimerecord } from "./timeRecord";

export async function createTimeRecordJson(
  divisions: { 所属コード: string }[]
) {
  // 修正申請リストを取得する
  const requestArray = await fetchRequestTimerecord();
  console.log("修正申請リスト");
  console.log(json2csv(requestArray));
  const records = [];
  const allRecords = [];
  const { start, end } = getTerm();
  console.log({ start, end });
  {
    for (const division of divisions) {
      const { lackingData, allData } = await fetchTimerecord(
        division.所属コード,
        start,
        end
      );
      allRecords.push(...allData);
      const filtered = lackingData.filter((record) => {
        for (const request of requestArray) {
          if (record.社員コード !== request.社員コード) continue;
          if (record.日付 !== request.日付) continue;
          return false;
        }
        return true;
      });
      records.push(...filtered);
    }
    return {
      lackingRecord: json2csv(records),
      allTimerecord: json2csv(allRecords),
    };
  }
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
  if (!json.requests) return [];
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
