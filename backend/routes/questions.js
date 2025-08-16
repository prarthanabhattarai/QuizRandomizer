// FILE: routes/questions.js
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET all questions
router.get('/', (req, res) => {
  Question.getAll((err, questions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(questions);
  });
});

// GET all questions for a given bankId
router.get('/bank/:bankId', (req, res) => {
  const bankId = req.params.bankId;
  Question.getByBankId(bankId, (err, questions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(questions);
  });
});

// CREATE a new question for a specific bank
router.post('/bank/:bankId/question', (req, res) => {
  const bankId = req.params.bankId;
  const { text, options, correctAnswer, difficulty } = req.body;

  if (!text || !options || !correctAnswer) {
    return res.status(400).json({ error: 'text, options, and correctAnswer are required' });
  }

  const questionData = {
    bankId,
    text,
    options: JSON.stringify(options),
    correctAnswer,
    difficulty: difficulty || 'easy'
  };

  Question.create(questionData, (err, newQuestion) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newQuestion);
  });
});

// UPDATE a question by bankId and question id
router.put('/bank/:bankId/question/:id', (req, res) => {
  const bankId = req.params.bankId;
  const id = req.params.id;
  const { text, options, correctAnswer, difficulty } = req.body;
  
  const updatedData = {};
  if (text) updatedData.text = text;
  if (options) updatedData.options = JSON.stringify(options);
  if (correctAnswer) updatedData.correctAnswer = correctAnswer;
  if (difficulty) updatedData.difficulty = difficulty;

  Question.update(id, updatedData, (err, updatedQuestion) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!updatedQuestion) return res.status(404).json({ error: 'Question not found' });
    res.json(updatedQuestion);
  });
});

// DELETE a question by bankId and question id
router.delete('/bank/:bankId/question/:id', (req, res) => {
  const bankId = req.params.bankId;
  const id = req.params.id;

  Question.deleteById(id, (err2) => {
    if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Question deleted successfully' });
    });
});

module.exports = router;