import { ACCESS_TOKEN } from "./utils";

(async () => {
  console.log("program start!");
  const url =
    "https://api.kingtime.jp/v1.0/daily-workings?division=1000&ondivision=true&start=2024-02-01&end=2024-02-28&additionalFields=currentDateEmployee";
  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };
  const result = await fetch(url, {
    headers,
  });
  const json = await result.json();
  console.log(json);
})();
