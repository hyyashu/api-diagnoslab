const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Add these arguments
  } // Stores session information in a local file
});

client.on("qr", (qr) => {
  // Generate and display QR code for authentication
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp client is ready");
});

client.on("authenticated", () => {
  console.log("WhatsApp client authenticated");
});

client.on("auth_failure", (msg) => {
  console.error("Authentication failed:", msg);
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out:", reason);
});

client.on("error", (error) => {
  console.error("Error occurred:", error);
});

// Initialize the client
client.initialize();

// Function to send a message to a WhatsApp group
const sendMessageToGroup = async (groupId, message) => {
  try {
    const chat = await client.getChatById(groupId);
    await chat.sendMessage(message);
    console.log("Message sent successfully");
  } catch (error) {
    console.log('====================================');
    console.log(message)
    console.log('====================================');
    console.error("Error sending message:", error);
  }
};

// Export client and function
module.exports = { client, sendMessageToGroup };
