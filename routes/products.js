const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shopsphere_products",
    allowed_formats: ["jpg","png","jpeg"]
  }
});

const upload = multer({ storage });

router.get("/", async(req,res)=>{
  const products = await Product.find();
  res.json(products);
});

router.post("/", upload.single("image"), async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock || 0,
      image: req.file?.path
    });

    await product.save();

    res.json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async(req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  res.json({message:"Product deleted"});
});

module.exports = router;
