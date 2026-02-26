require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");

const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");

const app = express();

connectDB();

app.use(cors({
origin:"https://macsoftwares51-creator.github.io"
}));

app.use(express.json());

app.use("/products",productRoutes);
app.use("/admin",adminRoutes);

app.get("/",(req,res)=>{
res.send("ShopSphere API running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
console.log("Server running on",PORT);
});