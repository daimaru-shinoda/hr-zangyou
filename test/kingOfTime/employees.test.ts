import { parseEmployeeJson } from "../../src/kingOfTime/employee";

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
