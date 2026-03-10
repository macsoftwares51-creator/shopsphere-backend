const express = require("express");
const router = express.Router();
const Seller = require("../models/SellerRequest");

const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const upload = multer({ dest: "uploads/" });

/* APPLY TO SELL */
router.post("/", upload.single("image"), async (req, res) => {
  try {

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "shopsphere-sellers"
    });

    const newSeller = new Seller({
      name: req.body.name,
      email: req.body.email,
      productName: req.body.productName,
      price: req.body.price,
      description: req.body.description,
      image: result.secure_url,
      status: "Pending"
    });

    await newSeller.save();

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* GET ALL */
router.get("/", async (req, res) => {
  const sellers = await Seller.find().sort({ createdAt: -1 });
  res.json(sellers);
});

/* APPROVE */
router.put("/:id", async (req, res) => {
  await Seller.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ success: true });
});
/* GET ONLY APPROVED PRODUCTS FOR CUSTOMERS */
router.get("/approved", async (req, res) => {
  try {
    // We look for "Approved" because that's what your PUT route saves
    const approvedSellers = await Seller.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(approvedSellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch approved products" });
  }
});
/* DELETE */
router.delete("/:id", async (req, res) => {
  await Seller.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
