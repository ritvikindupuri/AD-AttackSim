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
    <div className="bg-black/20 p-4 rounded-b-lg rounded-r-lg border-t-0 border border-green-500/20 backdrop-blur-sm h-auto animate-fade-in">
      <ul className="space-y-3 text-sm text-gray-300 h-[240px] overflow-y-auto pr-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-3">
            <ShieldIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DefensePanel;
