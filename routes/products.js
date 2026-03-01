const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ADD product
router.post("/", async (req,res)=>{
  try{

    const {name, price, category, image} = req.body;

    const product = new Product({
      name,
      price,
      category,
      image
    });

    await product.save();

    res.json(product);

  }catch(err){
    res.status(500).json({error: err.message});
  }
});


// DELETE product
router.delete("/:id", async (req,res)=>{
  try{
    await Product.findByIdAndDelete(req.params.id);
    res.json({message:"Product deleted"});
  }catch(err){
    res.status(500).json({error: err.message});
  }
});

module.exports = router;
