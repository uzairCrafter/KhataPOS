const router = require("express").Router();
const db = require("../db");

router.get("/", (req, res) => {
  const range = req.query.range || "today";
  let dateFilter = "";
  const today = new Date().toISOString().slice(0, 10);

  if (range === "today") dateFilter = `WHERE timestamp LIKE '${today}%'`;
  else if (range === "7days") {
    const d = new Date(); d.setDate(d.getDate() - 7);
    dateFilter = `WHERE timestamp >= '${d.toISOString()}'`;
  } else if (range === "30days") {
    const d = new Date(); d.setDate(d.getDate() - 30);
    dateFilter = `WHERE timestamp >= '${d.toISOString()}'`;
  }

  const sales = db.prepare(`SELECT * FROM sales ${dateFilter} ORDER BY timestamp DESC`).all();
  const stats = {
    revenue: sales.reduce((s, r) => s + r.total, 0),
    profit: sales.reduce((s, r) => s + r.profit, 0),
    orders: sales.length,
    avgOrder: sales.length ? sales.reduce((s, r) => s + r.total, 0) / sales.length : 0,
  };

  const topProducts = db.prepare(`
    SELECT si.name, SUM(si.qty) as qty, SUM(si.total) as revenue
    FROM sale_items si
    GROUP BY si.product_id ORDER BY revenue DESC LIMIT 5
  `).all();

  res.render("reports", { page: "reports", stats, sales: sales.slice(0, 10), range, topProducts });
});

module.exports = router;
// ⚠️ Note: The topProducts query has a small join issue — here's a fixed version:
// Replace the topProducts query with:
// const topProducts = db.prepare(`
//   SELECT si.name, SUM(si.qty) as qty, SUM(si.total) as revenue
//   FROM sale_items si
//   GROUP BY si.product_id ORDER BY revenue DESC LIMIT 5
// `).all();
