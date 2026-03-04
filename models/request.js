const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: String,
  email: String,
  product: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Request", requestSchema);
