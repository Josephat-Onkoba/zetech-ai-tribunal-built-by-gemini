import React, { useState, useCallback } from 'react';
import { Submission, AppStatus, RankedResult, LogEntry } from './types';
import TerminalHeader from './components/TerminalHeader';
import InputConsole from './components/InputConsole';
import SystemLogs from './components/SystemLogs';
import ResultsReport from './components/ResultsReport';
import { executeJudgment } from './services/geminiService';

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [results, setResults] = useState<RankedResult[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init',
      message: 'System initialized. Waiting for input streams...',
      type: 'INFO',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'INFO') => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        message,
        type,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const handleIngest = (data: { candidateName: string; poem: string }) => {
    const newSubmission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      candidateName: data.candidateName,
      poem: data.poem,
      timestamp: new Date().toLocaleTimeString(),
    };
    setSubmissions((prev) => [...prev, newSubmission]);
    addLog(`Ingested data for subject: ${data.candidateName.toUpperCase()}`, 'INFO');
  };

  const handleRemove = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    addLog(`Purged submission ID: ${id}`, 'WARNING');
  };

  const handleExecute = async () => {
    if (submissions.length === 0) {
      addLog('Execution failed: Buffer empty.', 'ERROR');
      return;
    }

    setStatus(AppStatus.PROCESSING);
    addLog('Establishing uplink to Gemini 2.5 Flash...', 'INFO');
    addLog('Transmitting payload...', 'INFO');

    try {
      const rankedResults = await executeJudgment(submissions);
      
      // Artificial delay for dramatic effect
      setTimeout(() => {
        setResults(rankedResults);
        setStatus(AppStatus.COMPLETED);
        addLog('Judgment Protocol Complete. Report generated.', 'SUCCESS');
      }, 1500);

    } catch (error: any) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      addLog(`FATAL ERROR: ${error.message || 'Unknown network anomaly'}`, 'ERROR');
    }
  };

  const handleReset = () => {
    setSubmissions([]);
    setResults([]);
    setStatus(AppStatus.IDLE);
    addLog('System Reset. Buffer cleared.', 'WARNING');
  };

  // Function to generate fake data for screenshots/demos
  const handleSimulation = () => {
    setStatus(AppStatus.PROCESSING);
    addLog('INITIATING SIMULATION MODE...', 'WARNING');
    
    setTimeout(() => {
      setResults([
        {
          rank: 1,
          candidateName: "Cyber_Poet_X",
          score: 98,
          roast: "This code compiles. The rhyme scheme is O(1) efficiency. Zetech professors would actually be impressed, which is rare.",
          creativity_score: 10,
          humor_score: 9,
          zetech_reference_score: 10
        },
        {
          rank: 2,
          candidateName: "Null_Pointer",
          score: 85,
          roast: "Tried to rhyme 'Ruiru' with 'CPU'. A bold strategy, let's see if it pays off. It didn't.",
          creativity_score: 8,
          humor_score: 9,
          zetech_reference_score: 7
        },
        {
          rank: 3,
          candidateName: "Infinite_Loop",
          score: 42,
          roast: "I've seen better poetry in a minified JavaScript file. At least you spelled 'Zetech' correctly.",
          creativity_score: 4,
          humor_score: 2,
          zetech_reference_score: 10
        }
      ]);
      setStatus(AppStatus.COMPLETED);
      addLog('SIMULATION COMPLETE. DISPLAYING MOCK DATA.', 'SUCCESS');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#0f0] font-mono p-4 sm:p-8 relative selection:bg-green-900 selection:text-white">
      {/* Scanline Overlay */}
      <div className="scanlines"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <TerminalHeader />

        <main>
          {status !== AppStatus.PROCESSING && status !== AppStatus.COMPLETED && (
             <InputConsole onIngest={handleIngest} disabled={status === AppStatus.PROCESSING} />
          )}
         
          <SystemLogs 
            logs={logs} 
            submissions={submissions} 
            onRemove={handleRemove}
            disabled={status !== AppStatus.IDLE && status !== AppStatus.ERROR}
          />

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {status !== AppStatus.COMPLETED && (
              <>
                <button
                  onClick={handleExecute}
                  disabled={submissions.length === 0 || status === AppStatus.PROCESSING}
                  className={`
                    flex-1 py-4 text-lg font-bold uppercase tracking-widest border-2 transition-all
                    ${status === AppStatus.PROCESSING 
                      ? 'border-yellow-600 text-yellow-500 cursor-wait animate-pulse' 
                      : 'border-[#0f0] text-[#0f0] hover:bg-[#0f0] hover:text-black shadow-[0_0_15px_rgba(0,255,0,0.3)]'}
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                  `}
                >
                  {status === AppStatus.PROCESSING ? '>> PROCESSING DATA STREAM...' : '>> EXECUTE JUDGMENT PROTOCOL'}
                </button>
                
                {/* Simulation Button for Screenshots */}
                <button
                  onClick={handleSimulation}
                  disabled={status === AppStatus.PROCESSING}
                  className="px-4 border border-green-800 text-green-700 hover:text-[#0f0] hover:border-[#0f0] uppercase font-bold text-xs tracking-widest transition-colors"
                  title="Generate Dummy Data for Screenshots"
                >
                  [ SIMULATE ]
                </button>
              </>
            )}
            
            {(status === AppStatus.COMPLETED || status === AppStatus.ERROR) && (
               <button
               onClick={handleReset}
               className="w-full py-3 border border-red-800 text-red-500 hover:bg-red-900/20 uppercase font-bold text-sm transition-colors"
             >
               >> System Reset / Clear Buffer
             </button>
            )}
          </div>

          {status === AppStatus.COMPLETED && <ResultsReport results={results} />}
        </main>

        <footer className="mt-12 text-center text-xs text-green-900">
          <p>ZETECH_UNIVERSITY_HACKATHON // NODE_ID: G-2.5-FLASH</p>
        </footer>
      </div>
    </div>
  );
};

export default App;