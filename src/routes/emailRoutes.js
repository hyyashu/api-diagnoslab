const express = require("express");
const router = express.Router();
const imapService = require("../services/imapService");
const emailController = require("../controllers/emailController");

router.post("/send", emailController.sendEmail);

router.get("/emails", async (req, res) => {
  try {
    const emails = await imapService.fetchAllEmails();
    res.json(emails);
  } catch (err) {
    console.error("Error fetching emails:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});
router.get("/check-emails", async (req, res) => {
  try {
    const emails = await imapService.checkEmails();
    res.json({ emails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
