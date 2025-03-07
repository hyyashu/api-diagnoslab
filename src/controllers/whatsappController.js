const { sendMessageToGroup } = require("../services/whatsappservice");

const sendGroupMessage = async (req, res) => {
  const { groupId, message } = req.body;

  // Validate that both groupId and message are provided
  if (!groupId || !message) {
    return res.status(400).json({ error: "Group ID and message are required" });
  }

  try {
    // Send the message to the specified WhatsApp group
    await sendMessageToGroup(groupId, message);
    res.status(200).json({ success: "Message sent successfully" });
  } catch (error) {
    console.log(error);

    // Handle any errors that occur during message sending
    res.status(500).json({ error: "Error sending message" });
  }
};

module.exports = {
  sendGroupMessage,
};
