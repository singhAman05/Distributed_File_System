// middleware/requestSignal.js
const requestSignal = (req, res, next) => {
  req.signal = new AbortController().signal;
  next();
};

module.exports = requestSignal;
