const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "gstore-secret-key-change-me",
  resave: false,
  saveUninitialized: false,
}));

// Auth middleware
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  res.locals.user = req.session.user;
  next();
}

// Routes
app.use("/", require("./routes/auth"));
app.use("/", requireLogin, require("./routes/dashboard"));
app.use("/inventory", requireLogin, require("./routes/inventory"));
app.use("/pos", requireLogin, require("./routes/pos"));
app.use("/khata", requireLogin, require("./routes/khata"));
app.use("/reports", requireLogin, require("./routes/reports"));

app.listen(PORT, () => console.log(`✅ G-Store Pro running at http://localhost:${PORT}`));
