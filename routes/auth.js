const router = require("express").Router();
const db = require("../db");

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", (req, res) => {
  const { username, pin } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ? AND pin = ?").get(username, pin);
  if (user) {
    req.session.user = { id: user.id, username: user.username, role: user.role };
    return res.redirect("/");
  }
  res.render("login", { error: "Invalid username or PIN" });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
