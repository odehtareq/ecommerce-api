const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUserStatus
} = require("../controllers/usersController");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { idParam } = require("../validators/commonValidators");
const {
  createUserRules,
  updateUserStatusRules
} = require("../validators/userValidators");

const router = express.Router();

// Admin only for now. Task 8 (IDOR) will let a user read their own record.
router.get("/", authenticate, authorize("admin"), getUsers);
router.get("/:id", authenticate, authorize("admin"), idParam, validate, getUserById);
router.post("/", authenticate, authorize("admin"), createUserRules, validate, createUser);
router.patch("/:id/status", authenticate, authorize("admin"), idParam, updateUserStatusRules, validate, updateUserStatus);

module.exports = router;