import React from 'react';

const TerminalHeader: React.FC = () => {
  return (
    <header className="mb-6 border-b-2 border-green-900 pb-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter glow-text text-[#0f0]">
            ZETECH AI TRIBUNAL <span className="text-xs align-top opacity-70">v2.0.4</span>
          </h1>
          <p className="text-xs text-green-700 mt-1 uppercase tracking-widest">
            // Judgment Protocol Initiated // System Ready
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-green-800">MEM: 64TB OK</div>
          <div className="text-xs text-green-800">CPU: QUANTUM OK</div>
          <div className="text-xs text-green-800">NET: SECURE</div>
        </div>
      </div>
    </header>
  );
};

export default TerminalHeader;