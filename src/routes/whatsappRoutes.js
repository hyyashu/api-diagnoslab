const express = require("express");
const router = express.Router();
const whatsappController = require("../controllers/whatsappController");

router.post("/sendMessageGroup", whatsappController.sendGroupMessage);

module.exports = router;
