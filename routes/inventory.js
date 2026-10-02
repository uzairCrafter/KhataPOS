const router = require("express").Router();
const db = require("../db");

router.get("/", (req, res) => {
  const search = req.query.search || "";
  const category = req.query.category || "";
  let products;
  if (search) {
    products = db.prepare("SELECT * FROM products WHERE name LIKE ? OR category LIKE ?").all(`%${search}%`, `%${search}%`);
  } else if (category) {
    products = db.prepare("SELECT * FROM products WHERE category = ?").all(category);
  } else {
    products = db.prepare("SELECT * FROM products ORDER BY name").all();
  }
  const categories = db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all().map(r => r.category);
  res.render("inventory", { page: "inventory", products, categories, search, category });
});

router.post("/add", (req, res) => {
  const { name, buy_price, sell_price, stock, min_stock, category } = req.body;
  db.prepare("INSERT INTO products (name, buy_price, sell_price, stock, min_stock, category) VALUES (?,?,?,?,?,?)")
    .run(name, +buy_price, +sell_price, +stock, +min_stock, category);
  res.redirect("/inventory");
});

router.post("/edit/:id", (req, res) => {
  const { name, buy_price, sell_price, stock, min_stock, category } = req.body;
  db.prepare("UPDATE products SET name=?, buy_price=?, sell_price=?, stock=?, min_stock=?, category=?, updated_at=datetime('now') WHERE id=?")
    .run(name, +buy_price, +sell_price, +stock, +min_stock, category, req.params.id);
  res.redirect("/inventory");
});

router.post("/delete/:id", (req, res) => {
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  res.redirect("/inventory");
});

module.exports = router;
