const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String
});

// 🔐 Hash password before saving
AdminSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔐 Compare password method
AdminSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
