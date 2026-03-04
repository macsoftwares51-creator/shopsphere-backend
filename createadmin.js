const mongoose = require("mongoose");
const Admin = require("./models/Admin"); // path to your Admin schema

async function createAdmin() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Mac");

  const admin = new Admin({
    username: "mac",             
    password: "Godisable" 
  });

  await admin.save(); 
  console.log("Admin created successfully!");

  mongoose.disconnect();
}

createAdmin();
