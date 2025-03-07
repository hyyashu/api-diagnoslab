const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

// Initialize the client
const client = new Client({
  authStrategy: new LocalAuth(),
});

// Generate and display QR code for authentication
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("QR Code generated, please scan it with your WhatsApp.");
});

// Handle client authentication
client.on("authenticated", () => {
  console.log("Client authenticated.");
});

// Handle client ready event
client.on("ready", () => {
  console.log("Client is ready.");
  sendBase64PDF();
});

// Function to convert base64 PDF to buffer
const base64ToBuffer = (base64Data) => {
  return Buffer.from(base64Data, "base64");
};

// Function to send a base64-encoded PDF
const sendBase64PDF = async () => {
  try {
    // Base64 encoded PDF data
    const base64PDF =""; // Replace with your base64-encoded PDF
    const buffer = base64ToBuffer(base64PDF);

    // Create a MessageMedia instance for PDF
    const media = new MessageMedia(
      "application/pdf",
      buffer.toString("base64"),
      "document.pdf"
    );

    // Send the media
    const chatId = "120363312991542668@g.us"; // Replace with the recipient's chat ID
    client
      .sendMessage(chatId, media)
      .then(() => {
        console.log("PDF sent successfully.");
      })
      .catch((error) => {
        console.error("Error sending PDF:", error);
      });
  } catch (error) {
    console.error("Error processing PDF:", error);
  }
};

// Start the client
client.initialize();
