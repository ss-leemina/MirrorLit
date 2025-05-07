const httpStatus = require("http-status-codes");

exports.logError = (err, req, res, next) => {
  console.error(stack);
  next(error);
};

exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  res.sendFile(`./public/${errorCode}.html`, {
    root: "./"
  });
};

exports.respondInternalError = (err, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  console.log(`Error occured: ${err.stack}`);
  res.status(errorCode);
  res.send(`${errorCode} | Sorry, out application is experiencing a problem`);
};