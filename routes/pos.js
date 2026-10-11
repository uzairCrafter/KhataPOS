const router = require("express").Router();
const db = require("../db");

router.get("/", (req, res) => {
  const products = db.prepare("SELECT * FROM products WHERE stock > 0 ORDER BY name").all();
  const customers = db.prepare("SELECT * FROM customers ORDER BY name").all();
  res.render("pos", { page: "pos", products, customers });
});

router.post("/checkout", (req, res) => {
  const { items, discount, payment_type, customer_id } = req.body;
  const cart = JSON.parse(items);
  if (!cart.length) return res.redirect("/pos");

  const invoiceId = "INV-" + Date.now().toString(36).toUpperCase();
  let subtotal = 0, profit = 0;

  cart.forEach(item => {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(item.product_id);
    if (product) {
      subtotal += product.sell_price * item.qty;
      profit += (product.sell_price - product.buy_price) * item.qty;
    }
  });

  const disc = parseFloat(discount) || 0;
  const total = subtotal - disc;
  profit = profit - disc;

  const sale = db.prepare(
    "INSERT INTO sales (invoice_id, subtotal, discount, total, profit, payment_type, customer_id) VALUES (?,?,?,?,?,?,?)"
  ).run(invoiceId, subtotal, disc, total, profit, payment_type, customer_id || null);

  cart.forEach(item => {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(item.product_id);
    db.prepare("INSERT INTO sale_items (sale_id, product_id, name, qty, price, total) VALUES (?,?,?,?,?,?)")
      .run(sale.lastInsertRowid, item.product_id, product.name, item.qty, product.sell_price, product.sell_price * item.qty);
    db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(item.qty, item.product_id);
  });

  if (payment_type === "credit" && customer_id) {
    db.prepare("UPDATE customers SET balance = balance + ? WHERE id = ?").run(total, customer_id);
    db.prepare("INSERT INTO khata (customer_id, amount, type, note, invoice_id) VALUES (?,?,?,?,?)")
      .run(customer_id, total, "credit", "Sale " + invoiceId, invoiceId);
  }

  res.redirect("/pos?invoice=" + invoiceId);
});

module.exports = router;
