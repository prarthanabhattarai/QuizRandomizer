// FILE: server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
// for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
const questionBankRoutes = require('./routes/questionBanks');
const questionRoutes = require('./routes/questions');


// Ensure database file path is consistent everywhere
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
  }
});

// Routes
app.use('/questionBanks', questionBankRoutes);
app.use('/questions', questionRoutes);
// TODO: enable this route when ready
//app.use('/', require('./routes/generate'));

// Root route
app.get('/', (req, res) => {
  res.send('Quiz API is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, db };