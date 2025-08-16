// FILE: utils/randomize.js
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateSets(questions, numSets, numQuestions) {
  const sets = [];
  for (let s = 0; s < numSets; s++) {
    const shuffled = shuffleArray(questions).slice(0, numQuestions);
    const answerKey = shuffled.map((q, idx) => ({ question_number: idx + 1, correct_answer: q.correct_answer }));
    sets.push({ id: s + 1, questions: shuffled, answerKey });
  }
  return sets;
}

module.exports = { shuffleArray, generateSets };

