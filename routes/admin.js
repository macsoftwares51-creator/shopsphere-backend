const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async(req,res)=>{

const admin = await Admin.findOne({username:req.body.username});

if(!admin) return res.status(400).json({error:"Admin not found"});

const valid = await bcrypt.compare(req.body.password,admin.password);

if(!valid) return res.status(400).json({error:"Wrong password"});

const token = jwt.sign({id:admin._id},process.env.JWT_SECRET);

res.json({token});

});

module.exports = router;