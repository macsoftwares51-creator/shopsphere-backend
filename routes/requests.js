const express = require("express");
const router = express.Router();
const Request = require("../models/requests");

/* CREATE REQUEST */
router.post("/", async (req, res) => {
  try {
    const { name, email, product } = req.body;

    if (!name || !email || !product) {
      return res.status(400).json({ success: false });
    }

    const newRequest = new Request({ name, email, product });
    await newRequest.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* GET ALL REQUESTS (Admin) */
router.get("/", async (req, res) => {
  const requests = await Request.find().sort({ createdAt: -1 });
  res.json(requests);
});

/* DELETE REQUEST */
router.delete("/:id", async (req, res) => {
  await Request.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* MARK AS ADDED */
router.put("/:id", async (req, res) => {
  await Request.findByIdAndUpdate(req.params.id, {
    status: "Added"
  });
  res.json({ success: true });
});

module.exports = router;
