import { parseHolidayDataJson } from "../../src/kingOfTime/holidays";

describe("parseHolidayDataJson", () => {
  it("should be parsed", () => {
    const testData = {
      year: "2019",
      startDate: "2019-01-01",
      endDate: "2019-12-31",
      closeDate: 30,
      employees: [
        {
          employeeKey:
            "8b6ee646a9620b286499c3df6918c4888a97dd7bbc6a26a18743f4697a1de4b3",
          currentDateEmployee: {
            divisionCode: "1000",
            divisionName: "本社",
            gender: "male",
            typeCode: "1",
            typeName: "正社員",
            code: "1000",
            lastName: "勤怠",
            firstName: "太郎",
            lastNamePhonetics: "キンタイ",
            firstNamePhonetics: "タロウ",
            employeeGroups: [
              {
                code: "0001",
                name: "人事部",
              },
              {
                code: "0002",
                name: "総務部",
              },
            ],
          },
          holidays: [
            {
              code: 1,
              name: "有休",
              granted: [
                {
                  date: "2019-01-01",
                  days: 5,
                  minutes: 120,
                  effectivePeriod: "2019-04-01",
                },
                {
                  date: "2019-04-01",
                  minutes: 180,
                  effectivePeriod: "2019-07-01",
                },
              ],
              obtained: [
                {
                  date: "2019-02-02",
                  days: 1,
                },
                {
                  date: "2019-05-10",
                  minutes: 180,
                },
              ],
              remained: [
                {
                  date: "2019-04-01",
                  days: 2,
                  minutes: 120,
                },
              ],
              expired: [
                {
                  date: "2019-06-01",
                  days: 3,
                },
                {
                  date: "2019-03-01",
                  minutes: 120,
                },
              ],
            },
            {
              code: 2,
              name: "代休",
              granted: [
                {
                  date: "2019-01-01",
                  days: 5,
                  minutes: 120,
                  effectivePeriod: "2019-04-01",
                },
                {
                  date: "2019-04-01",
                  minutes: 180,
                  effectivePeriod: "2019-07-01",
                },
              ],
              obtained: [
                {
                  date: "2019-02-02",
                  days: 3,
                },
                {
                  date: "2019-05-10",
                  minutes: 120,
                },
              ],
              remained: [
                {
                  date: "2019-04-01",
                  days: 2,
                  minutes: 120,
                },
              ],
              expired: [
                {
                  date: "2019-06-01",
                  days: 2,
                },
                {
                  date: "2019-03-01",
                  minutes: 120,
                },
              ],
            },
          ],
        },
      ],
    };
    const expected = {
      holidays: [
        {
          年度: "2019",
          雇用者キー:
            "8b6ee646a9620b286499c3df6918c4888a97dd7bbc6a26a18743f4697a1de4b3",
          社員名: "勤怠太郎",
          "休暇コード-1": 1,
          "休暇タイプ-1": "有休",
          "有休取得日数(日)": 1,
          "有休取得日数(日)予定込み": 1,
          "有休取得時間(分)": 180,
          "有休取得時間(分)予定込み": 180,
          "休暇コード-2": 2,
          "休暇タイプ-2": "代休",
          "代休取得日数(日)": 3,
          "代休取得日数(日)予定込み": 3,
          "代休取得時間(分)": 120,
          "代休取得時間(分)予定込み": 120,
          "失効済み-有休": 3,
          "失効済み-代休": 2,
        },
      ],
      yoteiHolidays: [],
    };
    const actual = parseHolidayDataJson(testData);
    // console.log(actual);
    expect(actual).toEqual(expected);
  });
});
