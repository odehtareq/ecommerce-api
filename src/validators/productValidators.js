const { body } = require("express-validator");

const createProductRules = [
  body("category_id")
    .isInt({ min: 1 })
    .withMessage("category_id must be a positive integer")
    .toInt(),
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Name must be between 2 and 150 characters"),
  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
  body("price")
    .isFloat({ gt: 0, max: 1000000 })
    .withMessage("Price must be greater than zero")
    .toFloat(),
  body("stock_quantity")
    .optional()
    .isInt({ min: 0, max: 1000000 })
    .withMessage("stock_quantity must be a non-negative integer")
    .toInt(),
  body("sku")
    .isString()
    .withMessage("SKU must be a string")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("SKU must be between 2 and 50 characters")
];

const updateProductRules = [
  ...createProductRules,
  body("is_active")
    .optional()
    .isBoolean({ strict: true })
    .withMessage("is_active must be true or false")
];

module.exports = { createProductRules, updateProductRules };