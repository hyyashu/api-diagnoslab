const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure, // Use the secure setting from config
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: config.email.user,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email!");
  }
};

module.exports = {
  sendEmail,
};
