const { exec } = require("child_process");

const handleWebhook = (req, res) => {
  const payload = req.body;

  if (payload.ref === "refs/heads/main") {
    // Send a response immediately
    res.status(200).send("Webhook received, processing...");

    // Run the commands asynchronously
    exec(
      "git pull origin main && npm install && pm2 restart all",
      (err, stdout, stderr) => {
        if (err) {
          console.error(`Error: ${stderr}`);
        } else {
          console.log(`Output: ${stdout}`);
        }
      }
    );
  } else {
    res.status(200).send("Not the main branch, no action taken!");
  }
};

const handleFacebookWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === "diagnoslabfb") {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      console.log("Responding with 403 Forbidden");
      res.sendStatus(403);
    }
  } else {
    res.json({ message: "Thank you for the message" });
  }
};

module.exports = {
  handleWebhook,handleFacebookWebhook,
};
