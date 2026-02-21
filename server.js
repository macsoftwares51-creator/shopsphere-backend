const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- CORS ---------- */
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ---------- FILE SETUP ---------- */
const dataFile = "products.json";

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

    if (!req.body.name || !req.body.price || !req.body.category) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const product = {
      id: Date.now(),
      name: req.body.name,
      price: Number(req.body.price),
      category: req.body.category,
      image: req.file ? `/uploads/${req.file.filename}` : null
    };

    products.push(product);

    fs.writeFileSync(
      dataFile,
      JSON.stringify(products, null, 2)
    );

    res.json({
      message: "Product saved",
      product
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to save product"
    });
  }
});

/* ---------- GET PRODUCTS ---------- */
app.get("/products", (req, res) => {
  try {

    const products = JSON.parse(
      fs.readFileSync(dataFile)
    );

    res.json(products);

  } catch (err) {

    res.status(500).json({
      message: "Failed to load products"
    });

  }
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
