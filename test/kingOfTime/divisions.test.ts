import { parseDivisionsJson } from "../../src/kingOfTime/divisions";

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
