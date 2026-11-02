const { body } = require("express-validator");

const registerRules = [
  body("full_name")
    .isString()
    .withMessage("full_name must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("full_name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ max: 150 })
    .withMessage("Email must be at most 150 characters")
    .normalizeEmail(),
  body("phone")
    .optional({ nullable: true })
    .isString()
    .withMessage("Phone must be a string")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Phone must be between 6 and 20 characters"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be between 8 and 72 characters")
];

const loginRules = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .isString()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password is required")
];

module.exports = { registerRules, loginRules };