import React from 'react';
import { RankedResult } from '../types';

interface ResultsReportProps {
  results: RankedResult[];
}

const ResultsReport: React.FC<ResultsReportProps> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <section className="border-2 border-[#0f0] bg-black p-6 relative shadow-[0_0_20px_rgba(0,255,0,0.1)] animate-in fade-in zoom-in duration-500">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-4 text-[#0f0] text-sm font-bold uppercase border border-[#0f0]">
        Final_Judgment_Report
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-green-800 text-green-600 text-xs uppercase tracking-wider">
              <th className="py-2 px-2">Rank</th>
              <th className="py-2 px-2">Identity</th>
              <th className="py-2 px-2">Score</th>
              <th className="py-2 px-2 w-1/2">Tribunal Roast</th>
              <th className="py-2 px-2 text-center">Metrics (C/H/Z)</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {results.map((r) => {
              const isWinner = r.rank === 1;
              return (
                <tr 
                  key={r.rank} 
                  className={`
                    border-b border-green-900/50 
                    ${isWinner ? 'text-yellow-400 font-bold bg-yellow-900/10' : 'text-green-400'}
                  `}
                >
                  <td className="py-4 px-2 text-xl">{isWinner ? '👑 #1' : `#${r.rank}`}</td>
                  <td className="py-4 px-2">{r.candidateName}</td>
                  <td className="py-4 px-2">
                    <div className="w-full bg-green-900/30 h-2 mt-1">
                      <div 
                        className={`h-full ${isWinner ? 'bg-yellow-400' : 'bg-[#0f0]'}`} 
                        style={{ width: `${r.score}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{r.score}/100</span>
                  </td>
                  <td className="py-4 px-2 italic opacity-90">"{r.roast}"</td>
                  <td className="py-4 px-2 text-center text-xs space-x-1">
                    <span title="Creativity" className="border border-green-800 px-1">{r.creativity_score}</span>
                    <span title="Humor" className="border border-green-800 px-1">{r.humor_score}</span>
                    <span title="Zetech Refs" className="border border-green-800 px-1">{r.zetech_reference_score}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-center text-xs text-green-800 uppercase">
        *** END OF REPORT ***
      </div>
    </section>
  );
};

export default ResultsReport;