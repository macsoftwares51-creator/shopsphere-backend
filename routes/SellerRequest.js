const express = require("express");
const router = express.Router();
const Seller = require("../models/SellerRequest");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shopsphere-sellers",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }
});

const upload = multer({ storage });
/* APPLY TO SELL */
router.post("/", async (req, res) => {
  const newSeller = new Seller(req.body);
  await newSeller.save();
  res.json({ success: true });
});

/* GET ALL */
router.get("/", async (req, res) => {
  const sellers = await Seller.find().sort({ createdAt: -1 });
  res.json(sellers);
});

/* APPROVE */
router.put("/:id", async (req, res) => {
  await Seller.findByIdAndUpdate(req.params.id, { status: "Approved" });
  res.json({ success: true });
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  await Seller.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
