import React, { useState } from 'react';
import '../../Tooltip/Tooltip.css';

export default function QuestionBankList({ banks, onSelectBank, onCreateBank }) {
  const [form, setForm] = useState({ name: '', description: '' });
  const API_BASE = 'http://localhost:4000';

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/questionBanks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create bank');
        return res.json();
      })
      .then(newBank => {
        // Directly call parent update function
        onCreateBank(newBank);
        setForm({ name: '', description: '' });
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
      
      {/* Left column - List of Banks */}
      <div style={{ flex: 1 }}>
        <h2>Question Banks</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {banks.map(bank => (
            <div
              key={bank.id}
              className="tooltip"
              style={{
                padding: '10px',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => onSelectBank(bank)}
            >
              {bank.name}
              <span className="tooltip-text">{bank.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column - Create New Bank */}
      <div style={{ flex: 1 }}>
        <h2>Create New Bank</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: '#fff',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          <input
            type="text"
            placeholder="Bank Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
          <textarea
            placeholder="Bank Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
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
            Save Bank
          </button>
        </form>
      </div>

    </div>
  );
}
