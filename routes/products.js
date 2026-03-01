const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({storage});

router.get("/", async(req,res)=>{
  const products = await Product.find();
  res.json(products);
});

router.post("/", upload.single("image"), async(req,res)=>{
  try{

    let imageUrl = "";

    if(req.file){
      const result = await cloudinary.uploader.upload_stream(
        {folder:"shopsphere"},
        async(error,result)=>{

          if(error) return res.status(500).json(error);

          imageUrl = result.secure_url;

          const product = new Product({
            name:req.body.name,
            price:req.body.price,
            category:req.body.category,
            image:imageUrl
          });

          await product.save();

          res.json(product);

        }
      ).end(req.file.buffer);
    }

  }catch(err){
    res.status(500).json({error:err.message});
  }
});

router.delete("/:id", async(req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  res.json({message:"Product deleted"});
});

module.exports = router;
