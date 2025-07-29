import { doFetch } from "../accessKingOfTime";

/**
 * 部署を取得する
 */
export async function fetchDivisions() {
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
  for (const { code, name } of json) {
    // 使用不可の場合は飛ばす
    ret.push({
      所属コード: code,
      所属名: name,
    });
  }
  return ret;
}
