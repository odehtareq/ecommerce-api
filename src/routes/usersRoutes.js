const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUserStatus
} = require("../controllers/usersController");

const validate = require("../middleware/validate");
const { idParam } = require("../validators/commonValidators");
const {
  createUserRules,
  updateUserStatusRules
} = require("../validators/userValidators");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", idParam, validate, getUserById);
router.post("/", createUserRules, validate, createUser);
router.patch("/:id/status", idParam, updateUserStatusRules, validate, updateUserStatus);

module.exports = router;