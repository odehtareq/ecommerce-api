const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory
} = require("../controllers/categoriesController");

const validate = require("../middleware/validate");
const { idParam } = require("../validators/commonValidators");
const {
  createCategoryRules,
  updateCategoryRules
} = require("../validators/categoryValidators");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", idParam, validate, getCategoryById);
router.post("/", createCategoryRules, validate, createCategory);
router.put("/:id", idParam, updateCategoryRules, validate, updateCategory);

module.exports = router;