const router = require("express").Router();
const db = require("../db");

router.get("/", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const sales = db.prepare("SELECT * FROM sales WHERE timestamp LIKE ?").all(today + "%");
  const stats = {
    totalSales: sales.reduce((s, r) => s + r.total, 0),
    totalProfit: sales.reduce((s, r) => s + r.profit, 0),
    count: sales.length,
  };
  const lowStock = db.prepare("SELECT * FROM products WHERE stock <= min_stock").all();
  res.render("dashboard", { page: "dashboard", stats, lowStock });
});

module.exports = router;
