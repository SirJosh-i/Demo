const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'names.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS names (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Database operations
const dbOperations = {
  // Insert a new name
  insertName: (name) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO names (name) VALUES (?)';
      db.run(sql, [name], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, name, created_at: new Date().toISOString() });
      });
    });
  },

  // Get all names
  getAllNames: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM names ORDER BY created_at DESC';
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Delete a name by ID
  deleteName: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM names WHERE id = ?';
      db.run(sql, [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }
};

module.exports = dbOperations;