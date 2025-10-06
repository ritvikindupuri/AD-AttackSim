import React from 'react';
import { ShieldIcon } from './Icons';

interface DefensePanelProps {
  recommendations: string[];
}

const DefensePanel: React.FC<DefensePanelProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-black/30 rounded-md border border-cyan-500/20 p-4 shadow-inner-cyan animate-fade-in">
      <h2
        className="text-2xl font-bold mb-4 text-cyan-300 tracking-wider flex items-center gap-2"
        style={{ fontFamily: "'Teko', sans-serif" }}
      >
        <ShieldIcon className="w-6 h-6" />
        DEFENSE RECOMMENDATIONS
      </h2>
      <ul className="space-y-3 text-sm text-gray-300">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-3">
            <ShieldIcon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DefensePanel;
