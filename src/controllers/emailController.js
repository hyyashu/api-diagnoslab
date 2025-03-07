const emailService = require("../services/emailService");

const sendEmail = async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await emailService.sendEmail(to, subject, text, html);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendEmail,
};
