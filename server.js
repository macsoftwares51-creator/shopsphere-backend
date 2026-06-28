require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");
const productRoutes = require("./routes/products");
const requestRoutes = require("./routes/requests");
const reviewRoutes = require("./routes/Review");
const SellerRequestRoutes = require("./routes/SellerRequest");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const app = express();

/* ---------- CONNECT DATABASE ---------- */
connectDB();

/* ---------- MIDDLEWARE (MUST COME FIRST) ---------- */

app.use(cors({

  origin: "https://macsoftwares51-creator.github.io",

  methods: ["GET","POST", "PATCH","PUT","DELETE"],

  credentials: true

}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/requests", requestRoutes);
app.use("/Review", reviewRoutes);
app.use("/SellerRequest", SellerRequestRoutes);
// Serve the static HTML page
app.use(express.static('public')); 

// The API Route
app.use('/proof', require('./routes/proof'));

/* ---------- ROUTES ---------- */

app.post("/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("ShopSphere API running");
});

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
