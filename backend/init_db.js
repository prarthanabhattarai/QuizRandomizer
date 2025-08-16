// FILE: init_db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  // Create question_banks table
  db.run(`
    CREATE TABLE IF NOT EXISTS question_banks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    )
  `);

  // Create questions table
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bankId INTEGER NOT NULL,
      text TEXT NOT NULL,
      options TEXT NOT NULL,
      correctAnswer TEXT NOT NULL,
      difficulty TEXT DEFAULT 'easy',
      FOREIGN KEY (bankId) REFERENCES question_banks(id) ON DELETE CASCADE
    )
  `);

  console.log('Tables created (if they did not exist already)');
});

db.close();