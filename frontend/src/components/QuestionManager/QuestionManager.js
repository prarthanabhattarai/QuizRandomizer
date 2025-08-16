import React, { useState, useEffect } from 'react';

export default function QuestionManager({ bank, onBack }) {
  const API_BASE = 'http://localhost:4000';
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ text: '', options: ['', '', '', ''], correctAnswer: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/questionBanks/${bank.id}/questions`)
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error(err));
  }, [bank]);

  const deleteQuestion = q => {
    if (!window.confirm('Delete this question?')) return;

    fetch(`${API_BASE}/questions/bank/${bank.id}/question/${q.id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete question');
        return res.json();
      })
      .then(() => {
        setQuestions(qs => qs.filter(x => x.id !== q.id));
      })
      .catch(() => alert('Error deleting question'));
  };

  const startEdit = q => {
    setEditId(q.id);
    const opts = JSON.parse(q.options);
    setForm({ text: q.text, options: opts, correctAnswer: q.correctAnswer });
  };

  const handleSubmit = e => {
  e.preventDefault();
  const method = editId ? 'PUT' : 'POST';
  const url = editId
    ? `${API_BASE}/questions/bank/${bank.id}/question/${editId}`
    : `${API_BASE}/questions/bank/${bank.id}/question`;

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })
    .then(res => res.json())
    .then(saved => {
      if (saved.error) {
        console.error(saved.error);
        alert('Error saving question');
        return;
      }

      // Instant local update
      if (editId) {
        setQuestions(qs => qs.map(q => (q.id === saved.id ? saved : q)));
      } else {
        setQuestions(qs => [...qs, saved]);
      }

      // Reset form
      setForm({ text: '', options: ['', '', '', ''], correctAnswer: '' });
      setEditId(null);

      // Silent re-fetch to ensure backend and frontend match
      fetch(`${API_BASE}/questions/bank/${bank.id}`)
        .then(res => res.json())
        .then(data => setQuestions(data))
        .catch(err => {
          console.error(err);
          alert('Error fetching updated questions');
        });
    })
    .catch(() => alert('Error saving question'));
};


  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: '20px',
          padding: '8px 12px',
          backgroundColor: '#6200ee',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Back to Banks
      </button>
      <h2>Manage Questions for: {bank.name}</h2>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* Left column: Add/Edit Question */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3>{editId ? 'Edit Question' : 'Add Question'}</h3>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Question Text"
              value={form.text}
              onChange={e => setForm({ ...form, text: e.target.value })}
              required
              style={{
                display: 'block',
                marginBottom: '10px',
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
            {form.options.map((opt, idx) => (
              <input
                key={idx}
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={e => {
                  const newOptions = [...form.options];
                  newOptions[idx] = e.target.value;
                  setForm({ ...form, options: newOptions });
                }}
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              />
            ))}
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Correct Answer:</label>
            <select
              value={form.correctAnswer}
              onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
              style={{
                display: 'block',
                marginBottom: '15px',
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            >
              <option value="">-- Select Correct Answer --</option>
              {form.options
                .filter(opt => opt.trim() !== '')
                .map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
            </select>

            <button
              type="submit"
              style={{
                padding: '10px 15px',
                backgroundColor: '#6200ee',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {editId ? 'Update' : 'Add'} Question
            </button>
          </form>
        </div>

        {/* Right column: Existing Questions */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3>Existing Questions</h3>
          {questions.length === 0 && <p>No questions found for this bank.</p>}
          <ol style={{ paddingLeft: '20px' }}>
            {questions.map(q => (
              <li
                key={q.id}
                style={{
                  border: '1px solid #ccc',
                  padding: 10,
                  marginBottom: 8,
                  borderRadius: 5,
                  backgroundColor: '#fafafa'
                }}
              >
                <strong>{q.text}</strong> <br />
                <em>Options:</em> {JSON.parse(q.options).join(', ')} <br />
                <em>Correct answer:</em> {q.correctAnswer} <br />
                <button
                  onClick={() => startEdit(q)}
                  style={{
                    marginRight: 10,
                    padding: '5px 10px',
                    backgroundColor: '#ff9800',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteQuestion(q)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
