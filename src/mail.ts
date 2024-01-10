import nodemailer from "nodemailer";

import { MAIL_JSON, loadJsonMail } from "./utils";

const TARGET_MAIL = "shinoda@daimaru-d.jp";

export async function sendMail(filePath: string) {
  const mailJson = loadJsonMail();
  const transporter = nodemailer.createTransport(
    createTransportFromJson(mailJson)
  );

  try {
    const mailDetails = createMailDetails(filePath, mailJson);
    const info = await transporter.sendMail(mailDetails);
    console.debug("sendmail success", info);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 *
 * @param auth 認証情報
 * @returns
 */
function createTransportFromJson(auth: { user: string; pass: string }) {
  return {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth,
  };
}

function createMailDetails(filePath: string, sender: MAIL_JSON) {
  const attachments = [{ filename: "StockExport.xlsx", path: filePath }];
  return {
    from: `ストロベリージャム <${sender.user}>`,
    to: TARGET_MAIL,
    subject: "ストロベリージャム 在庫集計",
    text: "ストロベリージャム 在庫集計",
    attachments,
  };
}
