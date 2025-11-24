const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// GET all menu items
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching menu items", error: err });
  }
});

// POST a new menu item
router.post("/", async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: "Error adding item", error: err });
  }
});

module.exports = router;
