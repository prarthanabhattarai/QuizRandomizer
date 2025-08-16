// FILE: utils/exportPdf.js
const { PDFDocument, StandardFonts } = require('pdf-lib');
const fs = require('fs/promises');

async function exportSetToPdf(set, filename, includeAnswers = false) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 50;
  const draw = (text, size = 12) => {
    page.drawText(text, { x: 50, y, size, font });
    y -= size + 6;
  };

  draw(`Quiz — Set ${set.id}`, 18);
  y -= 6;

  set.questions.forEach((q, idx) => {
    draw(`${idx + 1}. ${q.question_text}`, 12);
    draw(`A) ${q.option_a}`, 11);
    draw(`B) ${q.option_b}`, 11);
    draw(`C) ${q.option_c}`, 11);
    draw(`D) ${q.option_d}`, 11);
    y -= 6;
    if (y < 80) { // add new page
      page = pdfDoc.addPage();
      y = page.getSize().height - 50;
    }
  });

  if (includeAnswers) {
    y -= 10;
    draw('Answer Key', 14);
    set.answerKey.forEach(a => draw(`${a.question_number}. ${a.correct_answer}`, 12));
  }

  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(filename, pdfBytes);
}

module.exports = { exportSetToPdf };
