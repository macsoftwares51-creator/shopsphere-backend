const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ---------- FILE SETUP ---------- */
const dataFile = "products.json";
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]");

/* ---------- IMAGE UPLOAD ---------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

/* ---------- ADD PRODUCT ---------- */
app.post("/add-product", upload.single("image"), (req, res) => {
  const products = JSON.parse(fs.readFileSync(dataFile));

  const product = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    image: `/uploads/${req.file.filename}`
  };

  products.push(product);
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));

  res.json({ message: "Product saved" });
});

/* ---------- GET PRODUCTS ---------- */
app.get("/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync(dataFile));
  res.json(products);
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () =>
  console.log(`Server running → http://localhost:${PORT}`)
);
