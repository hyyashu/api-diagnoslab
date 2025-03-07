const express = require("express");
const router = express.Router();
const imapService = require("../services/imapService");

router.get("/check-emails", async (req, res) => {
  try {
    const emails = await imapService.checkEmails();
    res.json({ emails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
