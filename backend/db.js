const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ✅ Save todo.db inside backend/
const dbPath = path.join(__dirname, 'todo.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to open DB:', err.message);
  } else {
    console.log('✅ Connected to SQLite DB at', dbPath);
  }
});

// ✅ Ensure schema is created
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      username TEXT DEFAULT 'Anonymous',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
