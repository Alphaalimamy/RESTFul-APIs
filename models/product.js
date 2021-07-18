const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product mush have a name"],
    unique: true,
    trim: true,
  },
  price: { type: Number, required: [true, "A price is required"] },
  productImage: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
