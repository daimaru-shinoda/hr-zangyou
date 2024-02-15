import { sendMail } from "./mail";
import { FILE_PATHS, clearFiles, doDl } from "./accessKingOfTime";
import { sleep } from "./utils";

(async () => {
  console.log("program start!");
  await doDl();
  const attempts = FILE_PATHS.map((path) => {
    return { filename: path.replace(`./tmp/`, ""), path };
  });
  await sendMail(attempts);
  await sleep(2);
  await clearFiles();
})();
