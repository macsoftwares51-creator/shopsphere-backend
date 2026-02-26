const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  stock: { type: Number, default: 0 }
});

module.exports = mongoose.model("Product", ProductSchema);
