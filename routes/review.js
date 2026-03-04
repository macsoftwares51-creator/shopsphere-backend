const express = require("express");
const router = express.Router();
const Review = require("../models/review");

/* POST REVIEW */
router.post("/", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ success: false });
    }

    const newReview = new Review({ name, rating, comment });
    await newReview.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* GET REVIEWS */
router.get("/", async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

/* DELETE REVIEW */
router.delete("/:id", async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
