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
const authorizeSelfOrAdmin = require("../middleware/authorizeSelfOrAdmin");
const { idParam } = require("../validators/commonValidators");
const {
  createUserRules,
  updateUserStatusRules
} = require("../validators/userValidators");

const router = express.Router();

router.get("/", authenticate, authorize("admin"), getUsers);
router.get("/:id", authenticate, idParam, validate, authorizeSelfOrAdmin, getUserById);
router.post("/", authenticate, authorize("admin"), createUserRules, validate, createUser);
router.patch("/:id/status", authenticate, authorize("admin"), idParam, updateUserStatusRules, validate, updateUserStatus);

module.exports = router;