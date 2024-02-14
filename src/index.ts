import { sendMail } from "./mail";
import { doDl } from "./accessKingOfTime";

(async () => {
  console.log("program start!");
  await doDl();
  await sendMail([
    {
      filename: "divisions.csv",
      path: "./tmp/divisions.csv",
    },
    {
      filename: "employees.csv",
      path: "./tmp/employees.csv",
    },
    {
      filename: "allWorkings.csv",
      path: "./tmp/allWorkings.csv",
    },
    {
      filename: "allHolidays.csv",
      path: "./tmp/allHolidays.csv",
    },
  ]);
})();
