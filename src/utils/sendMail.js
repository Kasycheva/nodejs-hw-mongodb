import nodemailer from "nodemailer";
import { getEnvVar } from "./getEnvVar.js";

const transporter = nodemailer.createTransport({
  host: getEnvVar("SMTP_HOST"),
  port: Number(getEnvVar("SMTP_PORT")),
  auth: {
    user: getEnvVar("SMTP_USER"),
    pass: getEnvVar("SMTP_PASSWORD"),
  },
});

export const sendEmail = async ({ from, to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully to:", to);
    console.log("Email info:", info);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Failed to send email, please try again later.");
  }
};
