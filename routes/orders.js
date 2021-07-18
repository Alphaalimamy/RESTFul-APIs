const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-atuh");
const orderController = require("../controllers/orderController");

router
  .route("/")
  .get(checkAuth, orderController.getAllOrders)
  .post(checkAuth, orderController.createOrder);

router
  .route("/:orderId")
  .get(checkAuth, orderController.getSingleOrder)
  .patch(checkAuth, orderController.updateOrder)
  .delete(checkAuth, orderController.deleteOrder);

// 6. EXPORTING ORDERS
module.exports = router;
