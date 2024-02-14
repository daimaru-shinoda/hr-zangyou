import nodemailer from "nodemailer";

import { MAIL_JSON, loadJsonMail } from "./utils";

const TARGET_MAIL = "shinoda@daimaru-d.jp";

export async function sendMail(
  attachments: { filename: string; path: string }[]
) {
  const mailJson = loadJsonMail();
  const transporter = nodemailer.createTransport(
    createTransportFromJson(mailJson)
  );

  try {
    const mailDetails = createMailDetails(attachments, mailJson);
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

function createMailDetails(
  attachments: { filename: string; path: string }[],
  sender: MAIL_JSON
) {
  return {
    from: `勤怠管理 <${sender.user}>`,
    to: TARGET_MAIL,
    subject: "勤怠管理",
    text: "勤怠管理",
    attachments,
  };
}
