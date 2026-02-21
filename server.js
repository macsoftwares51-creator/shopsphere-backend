const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- CORS ---------- */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://macsoftwares51-creator.github.io");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.options("*", (req, res) => {
  res.sendStatus(200);
});

app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ---------- FILE SETUP ---------- */
const dataFile = path.join(__dirname, "products.json");

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]");
}

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* ---------- IMAGE UPLOAD ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ---------- ADD PRODUCT ---------- */
app.post("/add-product", upload.single("image"), (req, res) => {

  try {

    const products = JSON.parse(fs.readFileSync(dataFile));

    const product = {
      id: Date.now(),
      name: req.body.name,
      price: Number(req.body.price),
      category: req.body.category,
      image: req.file ? `/uploads/${req.file.filename}` : null
    };

    products.push(product);

    fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));

    res.json({
      success: true,
      product
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to save product"
    });

  }

});

/* ---------- GET PRODUCTS ---------- */
app.get("/products", (req, res) => {

  const products = JSON.parse(fs.readFileSync(dataFile));

  res.json(products);

});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
