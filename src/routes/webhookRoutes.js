const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhookController");

router.post("/update", webhookController.handleWebhook);
router.post("/facebook", webhookController.handleFacebookWebhook);
router.get("/facebook", webhookController.handleFacebookWebhook);

module.exports = router;
