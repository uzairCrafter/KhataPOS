const router = require("express").Router();
const db = require("../db");

router.get("/", (req, res) => {
  const customers = db.prepare("SELECT * FROM customers ORDER BY name").all();
  const selected = req.query.customer ? db.prepare("SELECT * FROM customers WHERE id = ?").get(req.query.customer) : null;
  const entries = selected ? db.prepare("SELECT * FROM khata WHERE customer_id = ? ORDER BY timestamp DESC").all(selected.id) : [];
  res.render("khata", { page: "khata", customers, selected, entries });
});

router.post("/add-customer", (req, res) => {
  const { name, phone } = req.body;
  db.prepare("INSERT INTO customers (name, phone) VALUES (?,?)").run(name, phone);
  res.redirect("/khata");
});

router.post("/add-entry", (req, res) => {
  const { customer_id, amount, type, note } = req.body;
  db.prepare("INSERT INTO khata (customer_id, amount, type, note) VALUES (?,?,?,?)").run(customer_id, +amount, type, note);
  const change = type === "credit" ? +amount : -amount;
  db.prepare("UPDATE customers SET balance = balance + ? WHERE id = ?").run(change, customer_id);
  res.redirect("/khata?customer=" + customer_id);
});

module.exports = router;
