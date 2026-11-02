const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory
} = require("../controllers/categoriesController");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { idParam } = require("../validators/commonValidators");
const {
  createCategoryRules,
  updateCategoryRules
} = require("../validators/categoryValidators");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", idParam, validate, getCategoryById);
router.post("/", authenticate, authorize("admin"), createCategoryRules, validate, createCategory);
router.put("/:id", authenticate, authorize("admin"), idParam, updateCategoryRules, validate, updateCategory);

module.exports = router;