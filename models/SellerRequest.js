const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  name: String,
  email: String,
  productName: String,
  price: Number,
  description: String,
  image: String,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SellerRequest", sellerSchema);
