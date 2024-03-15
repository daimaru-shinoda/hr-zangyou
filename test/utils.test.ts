import Decimal from "decimal.js";
import {
  getNendo,
  getTerm,
  parseDivisionsJson,
  parseEmployeeJson,
  parseHolidayDataJson,
  parseWorkingDataJson,
} from "../src/accessKingOfTime";
import { loadJsonMail, formatDate } from "../src/utils";

describe("loadJsonMail", () => {
  it("should not throw error", () => {
    const json = loadJsonMail();
    expect(json.pass).toBeDefined();
    expect(json.user).toBeDefined();
  });
});

describe("formatDate", () => {
  it("should formated", () => {
    const actual = formatDate(new Date(2023, 9, 10));
    expect(actual).toBe("2023-10-10");
  });
  it("should be padding 0", () => {
    const actual = formatDate(new Date(2023, 0, 1));
    expect(actual).toBe("2023-01-01");
  });
});

describe("parseWorkingDataJson", () => {
  it("should be parsed", () => {
    const testData = [
      {
        date: "2016-05-01",
        dailyWorkings: [
          {
            date: "2016-05-01",
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
            workPlaceDivisionCode: "1000",
            workPlaceDivisionName: "本社",
            isClosing: true,
            isHelp: false,
            isError: false,
            workdayTypeName: "平日",
            assigned: 480,
            unassigned: 135,
            overtime: 135,
            lateNight: 0,
            lateNightUnassigned: 0,
            lateNightOvertime: 0,
            breakTime: 60,
            late: 0,
            earlyLeave: 0,
            totalWork: 615,
            holidaysObtained: {
              fulltimeHoliday: {
                code: 1,
                name: "有休",
              },
              halfdayHolidays: [
                {
                  typeName: "PM休",
                  code: 1,
                  name: "有休",
                },
              ],
              hourHolidays: [
                {
                  start: "2016-05-01T10:00:00+09:00",
                  end: "2016-05-01T11:00:00+09:00",
                  minutes: 60,
                  code: 1,
                  name: "有休",
                },
              ],
            },
            autoBreakOff: 1,
            discretionaryVacation: 0,
            customDailyWorkings: [
              {
                code: "dCus1",
                name: "日別カスタム1",
                calculationUnitCode: 1,
                calculationResult: 1,
              },
              {
                code: "dCus2",
                name: "日別カスタム2",
                calculationUnitCode: 2,
                calculationResult: 10,
              },
              {
                code: "dCus3",
                name: "日別カスタム3",
                calculationUnitCode: 4,
                calculationResult: 100,
              },
            ],
          },
        ],
      },
    ];
    const expected = [
      {
        出勤フラグ: 1,
        日付: "2016-05-01",
        雇用者キー:
          "8b6ee646a9620b286499c3df6918c4888a97dd7bbc6a26a18743f4697a1de4b3",
        所属コード: "1000",
        所属名: "本社",
        残業時間: 135,
        合計勤務時間: 615,
      },
    ];
    const actual = parseWorkingDataJson(testData);
    expect(actual).toEqual(expected);
  });
});

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
                  days: 2,
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
        },
      ],
      yoteiHolidays: [],
    };
    const actual = parseHolidayDataJson(testData);
    // console.log(actual);
    expect(actual).toEqual(expected);
  });
});

describe("parseDivisionsJson", () => {
  it("should be parsed", () => {
    const testData = [
      {
        code: "1000",
        name: "本社",
        dayBorderTime: "00:00",
      },
      {
        code: "2000",
        name: "支社",
        dayBorderTime: "05:00",
      },
    ];
    const expected = [
      {
        所属コード: "1000",
        所属名: "本社",
      },
      {
        所属コード: "2000",
        所属名: "支社",
      },
    ];
    const actual = parseDivisionsJson(testData);
    // console.log(actual);
    expect(actual).toEqual(expected);
  });
});

describe("parseEmployeeJson", () => {
  it("should be parsed", () => {
    const testData = [
      {
        divisionCode: "1000",
        divisionName: "本社",
        gender: "male",
        typeCode: "1",
        typeName: "正社員",
        code: "1000",
        lastName: "勤怠",
        firstName: "太郎",
        key: "8b6ee646a9620b286499c3df6918c4888a97dd7bbc6a26a18743f4697a1de4b3",
        emailAddresses: ["kintaitarou@h-t.co.jp"],
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
      {
        divisionCode: "1000",
        divisionName: "本社",
        gender: "female",
        typeCode: "1",
        typeName: "正社員",
        code: "2000",
        lastName: "勤怠",
        firstName: "花子",
        key: "c77a34b32f5de30b6335d141ad714baf6713cd21ca98689efec9fe27352152c4",
        emailAddresses: ["kintaihanako@h-t.co.jp"],
        employeeGroups: [
          {
            code: "0003",
            name: "営業部",
          },
        ],
      },
    ];
    const expected = [
      {
        社員キー:
          "8b6ee646a9620b286499c3df6918c4888a97dd7bbc6a26a18743f4697a1de4b3",
        社員名: "勤怠太郎",
        所属コード: "1000",
        社員タイプコード: "1",
        社員タイプ: "正社員",
      },
      {
        社員キー:
          "c77a34b32f5de30b6335d141ad714baf6713cd21ca98689efec9fe27352152c4",
        社員名: "勤怠花子",
        所属コード: "1000",
        社員タイプコード: "1",
        社員タイプ: "正社員",
      },
    ];
    const actual = parseEmployeeJson(testData);
    expect(actual).toEqual(expected);
  });
});

describe("getTerm", () => {
  it("getTerm return start and end", () => {
    const mockDate = new Date(2024, 0, 25);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const actual = getTerm();
    expect(actual).toEqual({ start: "2024-01-21", end: "2024-02-20" });
  });
});

describe("getNendo", () => {
  it("getTerm return start and end", () => {
    const actual = getNendo();
    expect(actual).toEqual(2023);
  });
});

describe("decimal", () => {
  it("can plus", () => {
    const a = new Decimal(0.1);
    const actual = a.plus(0.2);
    expect(actual.toNumber()).toBeCloseTo(0.3);
  });
});
