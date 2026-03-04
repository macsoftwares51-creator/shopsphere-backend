const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");

router.post("/login", async (req,res)=>{
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if(!admin)
    return res.status(400).json({ message: "Admin not found" });

  const isMatch = await admin.comparePassword(password);

  if(!isMatch)
    return res.status(400).json({ message: "Wrong password" });

  res.json({ message: "Login successful" });
});

module.exports = router;
