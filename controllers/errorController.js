const httpStatus = require("http-status-codes");

// 404 not found error
exports.respondNoResourceFound = (err, req, res, next) => {
  let errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  res.send(`${errorCode} | Check url again`);
//  if there is a page for 404 error
//  res.sendFile(`./public/${errorCode}.html`, {
//    root: "./"
//  });
};

// 500 server error
exports.respondInternalError = (err, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  console.log(`Error occured: ${err.stack}`);
  res.status(errorCode);
  res.send(`${errorCode} | Sorry, out application is experiencing a problem`);
};
