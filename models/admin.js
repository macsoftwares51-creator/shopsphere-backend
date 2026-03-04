const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String
});
const Admin = require("./models/Admin"); // path to your Admin schema

async function createAdmin() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yourDB"); // replace yourDB with your DB name

  const admin = new Admin({
    username: "admin",              // choose your username
    password: "MySecurePassword123" // choose your password
  });

  await admin.save(); // will hash password automatically
  console.log("Admin created successfully!");

  mongoose.disconnect();
}

createAdmin();
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
