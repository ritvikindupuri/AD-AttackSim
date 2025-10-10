import React from 'react';
import { useHistory } from '../context/HistoryContext';
import { ExportedScenario } from '../services/aiService';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScenario: (scenario: ExportedScenario) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onLoadScenario }) => {
  const { history, clearHistory } = useHistory();

  if (!isOpen) {
    return null;
  }

  const handleLoad = (scenario: ExportedScenario) => {
    onLoadScenario(scenario);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-[#0c0c16] rounded-lg border border-green-500/30 shadow-2xl w-full max-w-2xl mx-4 p-6 flex flex-col h-[70vh] animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            Simulation History
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none">&times;</button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center pt-10">No past simulations found.</p>
          ) : (
            history.map((item, index) => (
              <div key={index} className="bg-zinc-900/70 p-3 rounded-md border border-green-500/20 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{item.scenarioData.title}</p>
                  <p className="text-xs text-gray-400">Attack: {item.userInput.attackType}</p>
                </div>
                <button
                  onClick={() => handleLoad(item)}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-4 rounded-md text-sm transition-colors"
                >
                  Load
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-between items-center flex-shrink-0">
          <button
            onClick={clearHistory}
            disabled={history.length === 0}
            className="bg-red-800 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Clear History
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
