import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "vanderson.doliveira14@gmail.com",
      pass: "ftvc ohxb wccb fuyv",
    },
  });

export async function sendEmail(title: string, text: string, to: string[], html?: string,) { 
   return await transporter.sendMail({
        from: '"Vanderson Oliveira" <vanderson.doliveira14@gmail.com>',
        to: to,
        subject: title,
        text: text,
        html: html,
    })
}