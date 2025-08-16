// models/Question.js
// Open the database file
const db = require('../db');

// CRUD functions
module.exports = {
  // Get all questions
  getAll(callback) {
    db.all('SELECT * FROM questions', [], callback);
  },

  // Get all questions for a given bankId
  getByBankId(bankId, callback) {
    db.all('SELECT * FROM questions WHERE bankId = ?', [bankId], callback);
  },

  // Create a new question
  create(question, callback) {
    db.run(
      'INSERT INTO questions (bankId, text, options, correctAnswer, difficulty) VALUES (?, ?, ?, ?, ?)',
      [
        question.bankId,
        question.text,
        question.options, // already JSON stringified in route
        question.correctAnswer,
        question.difficulty || 'easy'
      ],
      function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, ...question });
      }
    );
  },

  // Update a question
  update(id, updatedData, callback) {
    // Dynamically build SQL and values
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updatedData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) {
      return callback(null, null); // nothing to update
    }

    values.push(id); // where id = ?

    const sql = `UPDATE questions SET ${fields.join(', ')} WHERE id = ?`;
    db.run(sql, values, function (err) {
      if (err) return callback(err);
      if (this.changes === 0) return callback(null, null); // no row found
      callback(null, { id, ...updatedData });
    });
  },

  // Delete a question by ID
  deleteById(id, callback) {
    db.run('DELETE FROM questions WHERE id = ?', [id], function (err) {
      if (err) return callback(err);
      callback(null);
    });
  },

  // Delete all questions for a given bankId
  deleteByBankId(bankId, callback) {
    db.run('DELETE FROM questions WHERE bankId = ?', [bankId], callback);
  }
};