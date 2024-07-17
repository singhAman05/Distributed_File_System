// middleware/requestSignal.js
const { AbortController } = require("abort-controller");

const requestSignal = (req, res, next) => {
  const controller = new AbortController();
  req.signal = controller.signal;

  res.on("close", () => {
    if (!res.writableEnded) {
      controller.abort();
    }
  });

  next();
};

module.exports = requestSignal;
