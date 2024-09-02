import Decimal from "decimal.js";
import { formatDate } from "../src/utils";

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

describe("decimal", () => {
  it("can plus", () => {
    const a = new Decimal(0.1);
    const actual = a.plus(0.2);
    expect(actual.toNumber()).toBeCloseTo(0.3);
  });
});
