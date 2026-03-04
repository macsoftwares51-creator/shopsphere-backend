require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");

const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(express.json());
/* ---------- CONNECT DATABASE ---------- */
connectDB();

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
