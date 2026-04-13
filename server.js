const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

// Database
const db = new sqlite3.Database("./serials.db");

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS serials (
    serial TEXT PRIMARY KEY,
    used INTEGER DEFAULT 0
)
`);

// API
app.post("/activate", (req, res) => {
    const { serial } = req.body;

    db.get("SELECT * FROM serials WHERE serial = ?", [serial], (err, row) => {

        if (!row) {
            return res.json({ status: "invalid" });
        }

        if (row.used === 0) {
            db.run("UPDATE serials SET used = 1 WHERE serial = ?", [serial]);
            return res.json({ status: "activated" });
        } else {
            return res.json({ status: "used" });
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});