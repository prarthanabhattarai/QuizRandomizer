// FILE: utils/exportDocx.js
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs/promises');

async function exportSetToDocx(set, filename, includeAnswers = false) {
  const children = [];
  children.push(new Paragraph({ children: [new TextRun({ text: `Quiz — Set ${set.id}`, bold: true, size: 28 })] }));
  children.push(new Paragraph({ text: "" }));

  set.questions.forEach((q, idx) => {
    children.push(new Paragraph({ text: `${idx + 1}. ${q.question_text}` }));
    children.push(new Paragraph({ text: `A) ${q.option_a}` }));
    children.push(new Paragraph({ text: `B) ${q.option_b}` }));
    children.push(new Paragraph({ text: `C) ${q.option_c}` }));
    children.push(new Paragraph({ text: `D) ${q.option_d}` }));
    children.push(new Paragraph({ text: "" }));
  });

  if (includeAnswers) {
    children.push(new Paragraph({ text: "Answer Key", spacing: { before: 200 } }));
    set.answerKey.forEach(a => {
      children.push(new Paragraph({ text: `${a.question_number}. ${a.correct_answer}` }));
    });
  }

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(filename, buffer);
}

module.exports = { exportSetToDocx };

