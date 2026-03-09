const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

/* 1. PUBLIC GET: Only shows approved reviews */
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

/* 2. ADMIN GET: Shows ALL reviews (for your approval page) */
router.get("/admin/all", async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch all reviews" });
    }
});

/* 3. POST REVIEW: New reviews start as approved: false */
router.post("/", async (req, res) => {
    try {
        const { name, rating, comment } = req.body;
        const newReview = new Review({ name, rating, comment, approved: false });
        await newReview.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

/* 4. APPROVE REVIEW: Toggle the approved status */
router.patch("/approve/:id", async (req, res) => {
    try {
        await Review.findByIdAndUpdate(req.params.id, { approved: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

/* 5. DELETE REVIEW */
router.delete("/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;
