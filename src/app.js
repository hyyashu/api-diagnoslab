const express = require("express");
const cors = require("cors");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const loggingMiddleware = require("./middlewares/loggingMiddleware.js");
const emailRoutes = require("./routes/emailRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes.js");
const webhookRoutes = require("./routes/webhookRoutes");
const statusRoutes = require("./routes/statusRoutes");
const { monitorEmails } = require("./services/imapService");
const { client, sendMessageToGroup } = require("./services/whatsappservice.js");

// CORS configuration
const corsOptions = {
  origin: ["https://diagnoslab.in"], // Allow requests from domains
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // Allow credentials if needed
};

// app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Use CORS middleware
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());
app.use(loggingMiddleware);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Diangos Lab API!</h1>");
});

app.use("/email", emailRoutes);
app.use("/webhook", webhookRoutes);
app.use("/api/", statusRoutes);
app.use("/whatsapp/", whatsappRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
