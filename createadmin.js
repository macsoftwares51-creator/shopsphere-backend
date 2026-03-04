const mongoose = require("mongoose");
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
