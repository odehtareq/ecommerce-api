const { body } = require("express-validator");

const createCategoryRules = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters")
];

const updateCategoryRules = [
  ...createCategoryRules,
  body("is_active")
    .optional()
    .isBoolean({ strict: true })
    .withMessage("is_active must be true or false")
];

module.exports = { createCategoryRules, updateCategoryRules };