const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct
} = require("../controllers/productsController");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { idParam } = require("../validators/commonValidators");
const {
  createProductRules,
  updateProductRules
} = require("../validators/productValidators");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", idParam, validate, getProductById);
router.post("/", authenticate, authorize("admin"), createProductRules, validate, createProduct);
router.put("/:id", authenticate, authorize("admin"), idParam, updateProductRules, validate, updateProduct);
router.patch("/:id/deactivate", authenticate, authorize("admin"), idParam, validate, deactivateProduct);

module.exports = router;