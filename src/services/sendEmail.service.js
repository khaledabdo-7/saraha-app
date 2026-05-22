import nodemailer from "nodemailer";
import { EventEmitter } from "node:events";

export const sendEmailService = async ({ to, subject, html, attachments }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to,
      subject, // subject line
      html, // HTML body
      attachments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const emitter = new EventEmitter();

emitter.on("SendEmail", (data) => {
  const { to, subject, html, attachments } = data;
  sendEmailService({
    to,
    subject,
    html,
  });
});
