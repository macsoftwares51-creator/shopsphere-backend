require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");

const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");
const ADMIN_PASSWORD = "Godisable";
const app = express();
/* ---------- CONNECT DATABASE ---------- */
connectDB();
app.post("/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: "https://macsoftwares51-creator.github.io",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- ROUTES ---------- */
app.use("/products", productRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("ShopSphere API running");
});
/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
