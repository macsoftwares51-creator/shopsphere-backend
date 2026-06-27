const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  stock: { type: Number, default: 0 },
  description: { type: String, default: "" }
});

module.exports = mongoose.model("Product", productSchema);
