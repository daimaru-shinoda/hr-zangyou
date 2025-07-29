import { doDl, getAllWorkingData } from "./accessKingOfTime";

(async () => {
  console.log("program start!");
  await doDl();
  // await getAllWorkingData();
  console.log("program end!");
})();
