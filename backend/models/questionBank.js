// models/QuestionBank.js
// Open the database file
const db = require('../db');

module.exports = {
  // Get all question banks
  getAll(callback) {
    db.all('SELECT * FROM question_banks', [], callback);
  },

  // Get a single question bank by its ID
  getById(id, callback) {
    db.get('SELECT * FROM question_banks WHERE id = ?', [id], callback);
  },

  // Get all questions that belong to a specific bank
  getQuestionsByBankId(bankId, callback) {
    db.all('SELECT * FROM questions WHERE bankId = ?', [bankId], callback);
  },

  // Create a new question bank
  create(bank, callback) {
    db.run(
      'INSERT INTO question_banks (name, description) VALUES (?, ?)',
      [bank.name, bank.description],
      function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, ...bank });
      }
    );
  },

  // Delete a question bank by ID
  deleteById(id, callback) {
    db.run('DELETE FROM question_banks WHERE id = ?', [id], callback);
  },

  // Delete all questions for a given bank
  deleteQuestionsByBankId(bankId, callback) {
    db.run('DELETE FROM questions WHERE bankId = ?', [bankId], callback);
  }
};