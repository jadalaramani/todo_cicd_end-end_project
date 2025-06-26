const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todo.db');

// Create table if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
  )`);
});

module.exports = db;
