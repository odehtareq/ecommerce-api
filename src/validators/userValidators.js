const { body } = require("express-validator");

const ALLOWED_ROLES = ["customer", "admin"];

const createUserRules = [
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
        .optional()
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 8, max: 72 })
        .withMessage("Password must be between 8 and 72 characters"),
    body("role")
        .optional()
        .isIn(ALLOWED_ROLES)
        .withMessage("Role must be one of: " + ALLOWED_ROLES.join(", "))
];

const updateUserStatusRules = [
    body("is_active")
        .isBoolean({ strict: true })
        .withMessage("is_active must be true or false")
];

module.exports = {
    createUserRules,
    updateUserStatusRules,
    ALLOWED_ROLES
};