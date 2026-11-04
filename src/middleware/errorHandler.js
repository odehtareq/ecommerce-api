const STATUS_MESSAGES = {
  400: "Bad request",
  401: "Authentication required",
  403: "Forbidden",
  404: "Not found",
  413: "Request body too large",
  429: "Too many requests"
};

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  let status = error.status || error.statusCode || 500;
  let message = "Internal server error";

  if (error.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON body";
  } else if (status >= 400 && status < 500) {
    message = STATUS_MESSAGES[status] || "Bad request";
  } else {
    status = 500;
  }

  // Log details internally. Full error only outside production.
  if (process.env.NODE_ENV === "production") {
    console.error(
      `[${new Date().toISOString()}] ${req.method} ${req.path} -> ${status} ${error.code || error.name}`
    );
  } else {
    console.error(error);
  }

  res.status(status).json({
    success: false,
    message
  });
}

module.exports = errorHandler;