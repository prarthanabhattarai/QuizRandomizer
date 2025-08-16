// FILE: routes/questionBanks.js
const express = require('express');
const router = express.Router();
const QuestionBank = require('../models/QuestionBank');

// GET all question banks
router.get('/', (req, res) => {
  QuestionBank.getAll((err, banks) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(banks);
  });
});

// GET a single question bank by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  QuestionBank.getById(id, (err, bank) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!bank) return res.status(404).json({ error: 'Question bank not found' });
    res.json(bank);
  });
});

// GET all questions for a question bank
router.get('/:id/questions', (req, res) => {
  const bankId = req.params.id;
  QuestionBank.getQuestionsByBankId(bankId, (err, questions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(questions);
  });
});

// CREATE a new question bank
router.post('/', (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  QuestionBank.create({ name, description }, (err, bank) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(bank);
  });
});

// DELETE a question bank and its questions
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  // First delete questions in the bank
  QuestionBank.deleteQuestionsByBankId(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Then delete the bank itself
    QuestionBank.deleteById(id, (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Question bank and its questions deleted successfully' });
    });
  });
});

module.exports = router;