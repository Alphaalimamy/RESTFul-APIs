const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Product is required"],
    ref: "Product",
  },
  quantity: { type: Number, default: 1 },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
