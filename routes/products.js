const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const multer = require("multer");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post("/", upload.single("image"), async (req, res) => {
  try {

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products"
    });

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock || 0,
      image: result.secure_url
    });

    await product.save();

    res.json(product);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:id", async(req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  res.json({message:"Product deleted"});
});

module.exports = router;
