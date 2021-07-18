const express = require("express");
const router = express.Router();

// IMPORT
const checkAuth = require("../middleware/check-atuh");
const productController = require("../controllers/productController");

// 2. CREATE A PRODUCT

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    checkAuth,
    productController.upload.single("productImage"),
    productController.createProduct
  );

router
  .route("/:productId")
  .get(productController.getSingleProduct)
  .patch(checkAuth, productController.updateProduct)
  .delete(checkAuth, productController.deleteProduct);

// 6. EXPORTING ORDERS
module.exports = router;
