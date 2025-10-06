import React from 'react';
import { SparklesIcon } from './Icons';
import Loader from './Loader';

export type AttackScenario = 'Kerberoasting' | 'Pass-the-Hash' | 'Golden Ticket' | 'AS-REP Roasting' | 'ZeroLogon';

const availableScenarios: AttackScenario[] = [
  'Kerberoasting',
  'AS-REP Roasting',
  'Pass-the-Hash',
  'Golden Ticket',
  'ZeroLogon',
];

interface ControlPanelProps {
  environment: string;
  setEnvironment: (value: string) => void;
  scenario: AttackScenario;
  setScenario: (value: AttackScenario) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  environment,
  setEnvironment,
  scenario,
  setScenario,
  onGenerate,
  isLoading,
  error,
  setError,
}) => {
  
  const handleEnvChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEnvironment(e.target.value);
    if(error) setError(null);
  }
  
  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScenario(e.target.value as AttackScenario);
    if(error) setError(null);
  }

  return (
    <div className="bg-black/30 rounded-md border border-cyan-500/20 p-4 shadow-inner-cyan flex flex-col">
      <h2 
        className="text-2xl font-bold mb-4 text-cyan-300 tracking-wider" 
        style={{fontFamily: "'Teko', sans-serif"}}
      >
        ENGAGEMENT PARAMETERS
      </h2>
      
      <div className="mb-4">
        <label htmlFor="environment" className="block text-sm font-medium text-gray-300 mb-2">
          1. Describe AD Environment
        </label>
        <textarea
          id="environment"
          className="w-full h-48 bg-gray-900/50 border border-gray-600/50 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all resize-none placeholder-gray-500 text-sm"
          placeholder="e.g., A mid-sized corporate network with multiple domain controllers..."
          value={environment}
          onChange={handleEnvChange}
          disabled={isLoading}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-2">
          2. Select Attack Scenario
        </label>
        <select
          id="scenario"
          className="w-full bg-gray-900/50 border border-gray-600/50 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all text-sm"
          value={scenario}
          onChange={handleScenarioChange}
          disabled={isLoading}
        >
          {availableScenarios.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      
      {error && <p className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-500/30 p-2 rounded-md">{error}</p>}

      <button
        onClick={onGenerate}
        disabled={isLoading || !environment.trim()}
        className="mt-auto w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/40"
      >
        {isLoading ? (
          <>
            <Loader />
            DEPLOYING...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            DEPLOY SCENARIO
          </>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;
