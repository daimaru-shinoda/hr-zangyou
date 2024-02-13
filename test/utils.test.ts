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
