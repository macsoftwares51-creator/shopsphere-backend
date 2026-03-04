const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

router.post("/", async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
