const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const path = require("path");
const logger = require("../utils/logger");

// Create a rotating write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // Rotate daily
  path: path.join(__dirname, "../logs"),
});

// Morgan middleware for HTTP request logging
const httpLogger = morgan("combined", { stream: accessLogStream });

module.exports = {
  httpLogger,
  errorLogger: (err, req, res, next) => {
    logger.error(err);
    next(err); // Pass error to the next middleware
  },
};
