const FIELDS = ["name", "full_name", "sku"];

function rejectMarkup(req, res, next) {
  const body = req.body;

  if (body && typeof body === "object") {
    const errors = [];

    for (const field of FIELDS) {
      if (typeof body[field] === "string" && /[<>]/.test(body[field])) {
        errors.push({
          field,
          message: `${field} must not contain < or > characters`
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }
  }

  next();
}

module.exports = rejectMarkup;