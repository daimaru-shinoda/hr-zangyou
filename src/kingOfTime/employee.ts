import { doFetch } from "../accessKingOfTime";

/**
 * 社員を取得する
 * @see https://developer.kingtime.jp/#%E5%BE%93%E6%A5%AD%E5%93%A1-%E5%BE%93%E6%A5%AD%E5%93%A1%E3%83%87%E3%83%BC%E3%82%BF-get
 */
export async function fetchEmployee() {
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
