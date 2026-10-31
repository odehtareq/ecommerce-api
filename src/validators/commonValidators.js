const { param } = require("express-validator");

const idParam = param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .toInt();

module.exports = { idParam };