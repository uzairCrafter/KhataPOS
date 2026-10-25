# KhataPOS - Web-Based Point of Sale & Digital Ledger System

**Intern Name:** Uzair Shah   
**Domain:** Full-Stack Web Development  

---

## 📌 Project Overview
**KhataPOS** is a dynamic full-stack web application designed for small-to-medium retail businesses. It unifies daily sales, product inventory, digital customer/supplier ledgers (Khata), and business analytics into a single responsive web system.

---

## 🛠️ Tech Stack & Technologies
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), EJS (Embedded JavaScript Templates)
- **Backend:** Node.js, Express.js
- **Database:** SQLite3 (`gstore.db`)
- **Tools & Utilities:** Visual Studio Code, Git, GitHub, VBScript Launcher (`start_app.vbs`)

---

## 📂 Exact Repository Structure

```text
.
├── node_modules/           # Dependencies folder
├── public/                 # Static assets (CSS, images, JS)
├── routes/                 # Express backend route modules
│   ├── auth.js
│   ├── dashboard.js
│   ├── inventory.js
│   ├── khata.js
│   ├── pos.js
│   └── reports.js
├── views/                  # EJS template views
│   ├── dashboard.ejs
│   ├── footer.ejs
│   ├── header.ejs
│   ├── inventory.ejs
│   ├── khata.ejs
│   ├── layout.ejs
│   ├── login.ejs
│   ├── pos.ejs
│   └── reports.ejs
├── db.js                   # SQLite database connection setup
├── gstore.db               # SQLite main database file
├── gstore.db-shm           # SQLite shared memory file
├── gstore.db-wal           # SQLite write-ahead log
├── khataPOS-Demo.mp4       # Video demonstration of application
├── package.json            # Project dependencies and configurations
├── package-lock.json       # Dependency lock file
├── server.js               # Express application entry point
├── start_app.vbs           # Windows VBScript app launcher
└── README.md               # Project documentation
