const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const MenuItem = require("./models/MenuItem");
const menuRoutes = require("./routes/menuRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));


// ⭐ Insert menu items automatically if DB is empty
const seedMenu = async () => {
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    await MenuItem.insertMany([
      { name: "Espresso", category: "Hot Drinks", price: 300, inStock: true },
      { name: "Cappuccino", category: "Hot Drinks", price: 350, inStock: true },
      { name: "Latte", category: "Hot Drinks", price: 380, inStock: true },
      { name: "Iced Coffee", category: "Cold Drinks", price: 400, inStock: true },
      { name: "Chocolate Shake", category: "Cold Drinks", price: 450, inStock: true },
      { name: "Croissant", category: "Pastries", price: 250, inStock: false },
    ]);

    console.log("🍽️ Default menu inserted into MongoDB");
  }
};

mongoose.connection.once("open", seedMenu);


// Routes
app.use("/menu", menuRoutes);

app.get("/", (req, res) => res.send("Coffee Shop API Running ☕"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
