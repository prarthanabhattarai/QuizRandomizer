import React, { useState, useEffect } from 'react';
import QuestionBankList from './components/QuestionBankList/QuestionBankList';
import QuestionManager from './components/QuestionManager/QuestionManager';

export default function App() {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  const API_BASE = 'http://localhost:4000';

  useEffect(() => {
    fetch(`${API_BASE}/questionBanks`)
      .then(res => res.json())
      .then(data => setBanks(data))
      .catch(err => console.error(err));
  }, []);

  // NEW: No prompts here, just update state
  const handleCreateBank = (newBank) => {
    setBanks(prev => [...prev, newBank]);
  };

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
  };

  return (
    <div>
      {!selectedBank ? (
        <QuestionBankList
          banks={banks}
          onSelectBank={handleSelectBank}
          onCreateBank={handleCreateBank} // updated
        />
      ) : (
        <QuestionManager
          bank={selectedBank}
          onBack={() => setSelectedBank(null)}
        />
      )}
    </div>
  );
}
