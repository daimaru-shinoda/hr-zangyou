import { getNendo, getTerm } from "../src/accessKingOfTime";

describe("getTerm", () => {
  jest.useFakeTimers();
  it("getTerm return start and end at 2024-01-25", () => {
    jest.setSystemTime(new Date("2024-01-25"));
    const actual = getTerm();
    expect(actual).toEqual({ start: "2024-01-21", end: "2024-01-24" });
  });
  it("getTerm return start and end at 2024-01-20", () => {
    jest.setSystemTime(new Date("2024-01-20"));
    const actual = getTerm();
    expect(actual).toEqual({ start: "2023-12-21", end: "2024-01-19" });
  });
  it("getTerm return start and end at 2024-01-21", () => {
    jest.setSystemTime(new Date("2024-01-21"));
    const actual = getTerm();
    expect(actual).toEqual({ start: "2023-12-21", end: "2024-01-20" });
  });
});

describe("getNendo", () => {
  jest.useFakeTimers();
  it("getNendo return nendo", () => {
    jest.setSystemTime(new Date("2024-01-25"));
    const actual = getNendo();
    expect(actual).toEqual(2023);
  });
});
