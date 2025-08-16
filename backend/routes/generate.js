// FILE: routes/generate.js
const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { generateSets } = require('../utils/randomize');
const path = require('path');
const os = require('os');
const { exportSetToDocx } = require('../utils/exportDocx');
const { exportSetToPdf } = require('../utils/exportPdf');
const { v4: uuidv4 } = require('uuid');

// POST /generate-sets
// body: { question_bank_id, num_sets, num_questions }
router.post('/generate-sets', (req, res) => {
  const { question_bank_id, num_sets = 1, num_questions } = req.body;
  if (!question_bank_id) return res.status(400).json({ error: 'question_bank_id required' });

  db.all('SELECT * FROM questions WHERE question_bank_id = ?', [question_bank_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'no questions found for bank' });

    const nq = Math.min(num_questions || rows.length, rows.length);
    const sets = generateSets(rows, parseInt(num_sets, 10), nq);
    res.json({ sets });
  });
});

// POST /export
// body: { sets, format: 'pdf'|'docx', includeAnswers: boolean }
router.post('/export', async (req, res) => {
  const { sets, format = 'pdf', includeAnswers = false } = req.body;
  if (!sets || !Array.isArray(sets) || sets.length === 0) return res.status(400).json({ error: 'sets required' });

  const tmpDir = os.tmpdir();
  const files = [];

  try {
    for (const set of sets) {
      const filename = path.join(tmpDir, `quiz_set_${set.id || uuidv4()}.${format}`);
      if (format === 'docx') {
        await exportSetToDocx(set, filename, includeAnswers);
      } else {
        await exportSetToPdf(set, filename, includeAnswers);
      }
      files.push(filename);
    }

    // if single file, send it directly; if multiple, zip (not implemented) -> send array of file paths
    if (files.length === 1) {
      res.download(files[0]);
    } else {
      // For simplicity, return file paths. Frontend can request /download?file=...
      res.json({ files });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

