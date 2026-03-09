const express = require("express");
const router = express.Router();
const Seller = require("../models/SellerRequest");

const multer = require("multer");
const cloudinary = require("../config/cloudinary");


const upload = multer({ storage });

/* APPLY TO SELL */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newSeller = new Seller({
      name: req.body.name,
      email: req.body.email,
      productName: req.body.productName,
      price: req.body.price,
      description: req.body.description,
      image: req.file.path,
      status: "Pending"
    });

    await newSeller.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json(err);
  }
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
