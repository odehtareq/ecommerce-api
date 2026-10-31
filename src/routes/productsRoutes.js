const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct
} = require("../controllers/productsController");

const validate = require("../middleware/validate")
const { idParam } = require("../validators/commonValidators");
const {
  createProductRules,
  updateProductRulse
} = require("../validators/productValidators");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", idParam, validate, getProductById);
router.post("/", createProductRules, validate, createProduct);
router.put("/:id", idParam, updateProductRulse, updateProduct);
router.patch("/:id/deactivate", idParam, validate, deactivateProduct);

module.exports = router;