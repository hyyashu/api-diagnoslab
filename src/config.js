require("dotenv").config();

const config = {
  email: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // Convert string to boolean
  },
  imap: {
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT,
  },
};

module.exports = config;
