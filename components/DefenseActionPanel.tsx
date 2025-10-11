import React from 'react';
import { ShieldIcon } from './Icons';
import Loader from './Loader';

interface DefenseActionPanelProps {
  choices: string[];
  onAction: (action: string) => void;
  isLoading: boolean;
}

const DefenseActionPanel: React.FC<DefenseActionPanelProps> = ({ choices, onAction, isLoading }) => {
  return (
    <div className="mt-6 p-6 bg-black/40 rounded-lg border border-purple-500/30 backdrop-blur-sm animate-fade-in">
        <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-1" style={{fontFamily: "'Exo 2', sans-serif"}}>
                Blue Team: Your Move
            </h3>
            <p className="text-sm text-purple-300/80 mb-6">
                The adversary has made their move. Choose your defensive response.
            </p>
        </div>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center h-24">
                <Loader />
                <p className="font-bold text-gray-300">Red Team is planning their next move...</p>
                <p className="text-xs text-gray-500">The AI is analyzing your action and formulating a response.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(choices || []).map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => onAction(choice)}
                        disabled={isLoading}
                        className="flex flex-col items-center justify-center text-center gap-3 p-4 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/40 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 h-full"
                    >
                        <ShieldIcon className="w-8 h-8 text-purple-300" />
                        <span className="font-semibold text-gray-200 text-sm">{choice}</span>
                    </button>
                ))}
            </div>
        )}
    </div>
  );
};

export default DefenseActionPanel;