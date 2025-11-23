import React, { useState } from 'react';
import { Submission } from '../types';

interface InputConsoleProps {
  onIngest: (submission: Omit<Submission, 'id' | 'timestamp'>) => void;
  disabled: boolean;
}

const InputConsole: React.FC<InputConsoleProps> = ({ onIngest, disabled }) => {
  const [candidateName, setCandidateName] = useState('');
  const [poem, setPoem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !poem.trim()) return;

    onIngest({ candidateName, poem });
    setCandidateName('');
    setPoem('');
  };

  return (
    <section className="border border-green-900 bg-black/50 p-4 mb-6 relative border-glow">
      <div className="absolute -top-3 left-4 bg-black px-2 text-green-600 text-xs font-bold uppercase">
        Input_Stream
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-green-700 font-bold">>> Target_Identity (Candidate Name)</label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            disabled={disabled}
            className="bg-black border border-green-800 text-[#0f0] p-2 focus:outline-none focus:border-[#0f0] focus:ring-1 focus:ring-[#0f0] transition-all font-mono"
            placeholder="e.g. USER_404"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-green-700 font-bold">>> Data_Payload (Poem)</label>
          <textarea
            value={poem}
            onChange={(e) => setPoem(e.target.value)}
            disabled={disabled}
            rows={4}
            className="bg-black border border-green-800 text-[#0f0] p-2 focus:outline-none focus:border-[#0f0] focus:ring-1 focus:ring-[#0f0] transition-all font-mono resize-y"
            placeholder="Enter submission data here..."
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !candidateName || !poem}
          className="w-full sm:w-auto bg-green-900/20 border border-green-600 text-[#0f0] px-6 py-2 hover:bg-green-900/40 hover:text-white transition-colors uppercase font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <span className="mr-2 group-hover:animate-blink-cursor">></span> Ingest Data
        </button>
      </form>
    </section>
  );
};

export default InputConsole;