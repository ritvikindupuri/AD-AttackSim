import React from 'react';
import { AttackStep } from '../services/aiService';
import { ChevronRightIcon } from './Icons';

interface HistoryPanelProps {
    steps: AttackStep[];
    activeStepIndex: number;
    setActiveStepIndex: (index: number) => void;
    revealedSteps: number[];
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ steps, activeStepIndex, setActiveStepIndex, revealedSteps }) => {
  return (
    <div className="bg-[#1a1a2e]/60 p-4 rounded-lg border border-purple-500/30 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-3" style={{fontFamily: "'Exo 2', sans-serif"}}>
            Attack Path
        </h3>
        <ul className="space-y-1">
            {steps.map((step, index) => {
                const isRevealed = revealedSteps.includes(index);
                const isActive = index === activeStepIndex;
                return (
                    <li key={index}>
                        <button 
                            onClick={() => setActiveStepIndex(index)}
                            disabled={!isRevealed}
                            className={`w-full text-left p-2 rounded-md transition-colors flex items-center justify-between gap-2 text-sm ${
                                isActive 
                                ? 'bg-green-500/20 text-green-300' 
                                : isRevealed 
                                ? 'text-gray-300 hover:bg-white/10'
                                : 'text-gray-600 cursor-not-allowed'
                            }`}
                        >
                           <span className="truncate">{index + 1}. {isRevealed ? step.title : '??????????'}</span>
                           {isActive && <ChevronRightIcon className="w-4 h-4 flex-shrink-0" />}
                        </button>
                    </li>
                )
            })}
        </ul>
    </div>
  );
};

export default HistoryPanel;