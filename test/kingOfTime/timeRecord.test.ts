import { parseTimeRecordJson } from "../../src/kingOfTime/timeRecord";

describe("parseTimerecordJson", () => {
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
            timeRecord: [
              {
                time: "2016-05-01T09:00:00+09:00",
                code: "1",
                name: "出勤",
                divisionCode: "1000",
                divisionName: "本社",
                latitude: 35.667224,
                longitude: 139.742221,
              },
              {
                time: "2015-05-01T18:00:00+09:00",
                code: "2",
                name: "退勤",
                divisionCode: "1000",
                divisionName: "本社",
                credentialCode: 300,
                credentialName: "KOTSL",
                latitude: 35.667224,
                longitude: 139.742221,
              },
              {
                time: "2016-05-01T10:00:00+09:00",
                code: "3",
                name: "休憩開始",
                divisionCode: "1000",
                divisionName: "本社",
              },
              {
                time: "2016-05-01T11:00:00+09:00",
                code: "4",
                name: "休憩終了",
                divisionCode: "1000",
                divisionName: "本社",
              },
            ],
          },
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
              firstName: "花子",
              lastNamePhonetics: "キンタイ",
              firstNamePhonetics: "ハナコ",
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
            timeRecord: [
              {
                time: "2016-05-01T09:00:00+09:00",
                code: "1",
                name: "出勤",
                divisionCode: "1000",
                divisionName: "本社",
                latitude: 35.667224,
                longitude: 139.742221,
              },
              {
                time: "2016-05-01T10:00:00+09:00",
                code: "3",
                name: "休憩開始",
                divisionCode: "1000",
                divisionName: "本社",
              },
              {
                time: "2016-05-01T11:00:00+09:00",
                code: "4",
                name: "休憩終了",
                divisionCode: "1000",
                divisionName: "本社",
              },
            ],
          },
        ],
      },
    ];
    const { lackingData } = parseTimeRecordJson(testData, "1234");
    expect(lackingData).toEqual([
      {
        日付: "2016-05-01",
        勤務開始: "2016-05-01 09:00",
        勤務終了: "",
        社員名: "勤怠花子",
        社員コード:
          "8b6ee646a9620b286499c3df6918c4888a97dd7bbc6a26a18743f4697a1de4b3",
        社員タイプ: "正社員",
        所属コード: "1234",
      },
    ]);
  });
});
