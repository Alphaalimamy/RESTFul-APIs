const multer = require("multer");
const Product = require("../models/product");

// MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 15,
  },

  fileFilter: fileFilter,
});

//GET ALL PRODUCTS
exports.getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await Product.find({});
    res.status(200).json({
      status: "Success",
      data: {
        allProducts,
      },
    });
  } catch (err) {
    res.status(400).jason({
      status: "Fail",
      message: err.message,
    });
  }
};

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    // console.log(req.file);
    let product = new Product({
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.filename,
    });
    product = await product.save();
    res.status(201).json({
      status: "success",
      product: product,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// GET SINGLE
exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  console.log(product);
  try {
    if (product) {
      res.status(200).json({
        status: "Success",
        data: {
          product,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + product._id,
        },
      });

      if (!product) {
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
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "Success",
      data: { product },
    });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.productId,
      req.body
    );
    res
      .status(204)
      .json({ status: "success", message: "Product deleted", data: product });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};
