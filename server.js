const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- CORS FIX ---------- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

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
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ---------- ADD PRODUCT ---------- */
app.post("/add-product", upload.single("image"), (req, res) => {
  try {

    if (!req.body.name || !req.body.price || !req.body.category) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const products = JSON.parse(fs.readFileSync(dataFile));

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

    console.error("ADD PRODUCT ERROR:", err);

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

    console.error("GET PRODUCTS ERROR:", err);

    res.status(500).json({
      message: "Failed to load products"
    });

  }
});

/* ---------- SERVER START ---------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
