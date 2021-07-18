const Order = require("../models/order");
const Product = require("../models/product");
//GET ALL ORDERS
exports.getAllOrders = async (req, res, next) => {
  try {
    const allOrder = await Order.find({}).populate("product");
    res.status(200).json({
      status: "Success",
      data: {
        count: allOrder.length,
        allOrder,
      },
    });
  } catch (err) {
    res.status(404).jason({
      status: "Fail",
      message: err.message,
    });
  }
};

// CREATE ORDER
exports.createOrder = async (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      return Order.create(req.body);
    })
    .then((order) => {
      res.status(201).json({
        status: "Success",
        data: {
          totalRecords: order.length,
          order,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + order._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(404).json({
        status: "FAIL",
        message: err.message,
      });
    });
};

// GET SINGLE
exports.getSingleOrder = async (req, res, next) => {
  const singleOrder = await Order.findById(req.params.orderId);
  console.log(singleOrder);
  try {
    if (singleOrder) {
      res.status(200).json({
        status: "Success",
        data: {
          singleOrder,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + singleOrder._id,
        },
      });

      if (!singleOrder) {
        res.status(404).json({
          status: "Fail",
          data: {
            message: "Product not found",
          },
        });
      }
    }
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: "Cannot find product",
    });
  }
};

// UPDATE
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.orderId, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "Success",
      data: { order },
    });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

// DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId, req.body);
    res.status(204).json({ status: "success", data: order });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};
