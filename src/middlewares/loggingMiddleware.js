// middlewares/loggingMiddleware.js

const loggingMiddleware = (req, res, next) => {
    console.log("-------------- New Request --------------");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Headers:", JSON.stringify(req.headers, null, 3));
    console.log("Body:", JSON.stringify(req.body, null, 3));
    next(); // Pass control to the next middleware/route handler
  };
  
  module.exports = loggingMiddleware;
  