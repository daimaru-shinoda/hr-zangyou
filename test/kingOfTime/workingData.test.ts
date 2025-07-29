import { parseWorkingDataJson } from "../../src/kingOfTime/workingData";

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
        社員名: "勤怠太郎",
        所属コード: "1000",
        所属名: "本社",
        残業時間: 135,
        合計勤務時間: 615,
        エラー: "",
      },
    ];
    const actual = parseWorkingDataJson(testData);
    expect(actual).toEqual(expected);
  });
});
