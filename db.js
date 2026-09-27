const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "gstore.db"));
db.pragma("journal_mode = WAL");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    pin TEXT NOT NULL,
    role TEXT DEFAULT 'staff',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    buy_price REAL NOT NULL,
    sell_price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 5,
    category TEXT DEFAULT 'General',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    balance REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id TEXT UNIQUE NOT NULL,
    subtotal REAL,
    discount REAL DEFAULT 0,
    total REAL,
    profit REAL,
    payment_type TEXT DEFAULT 'cash',
    customer_id INTEGER,
    timestamp TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    product_id INTEGER,
    name TEXT,
    qty INTEGER,
    price REAL,
    total REAL,
    FOREIGN KEY (sale_id) REFERENCES sales(id)
  );

  CREATE TABLE IF NOT EXISTS khata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    note TEXT,
    invoice_id TEXT,
    timestamp TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`);

// Seed default admin if not exists
const adminExists = db.prepare("SELECT id FROM users WHERE username = 'admin'").get();
if (!adminExists) {
  db.prepare("INSERT INTO users (username, pin, role) VALUES (?, ?, ?)").run("admin", "1234", "admin");
  
  // Seed products
  const insert = db.prepare("INSERT INTO products (name, buy_price, sell_price, stock, min_stock, category) VALUES (?,?,?,?,?,?)");
  insert.run("Surf Excel 1kg", 280, 320, 45, 10, "Detergent");
  insert.run("Tapal Danedar 200g", 180, 220, 30, 8, "Tea");
  insert.run("Nestle Milk Pack 1L", 230, 270, 3, 10, "Dairy");
  insert.run("Lays Classic Large", 80, 100, 60, 15, "Snacks");
  insert.run("Coca Cola 1.5L", 140, 170, 5, 12, "Beverages");
  insert.run("National Ketchup 400g", 190, 230, 20, 5, "Sauces");

  // Seed customers
  const insertC = db.prepare("INSERT INTO customers (name, phone, balance) VALUES (?,?,?)");
  insertC.run("Ahmed Khan", "0300-1234567", 1500);
  insertC.run("Bilal Sheikh", "0321-9876543", 0);
}

module.exports = db;
