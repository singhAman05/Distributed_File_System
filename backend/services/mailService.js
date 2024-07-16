// services/mailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    to,
    from: `${process.env.SMTP_USER}`,
    subject,
    text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(info);
    });
  });
};

module.exports = {
  sendEmail,
};
