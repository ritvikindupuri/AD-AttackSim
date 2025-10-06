import React from 'react';
import { AttackStep } from '../services/geminiService';
import Tooltip from './Tooltip';
import MitreExplanation from './MitreExplanation';

interface SystemStatePanelProps {
  currentStep: AttackStep | null;
  totalCompromised: number;
}

const SystemStatePanel: React.FC<SystemStatePanelProps> = ({ currentStep, totalCompromised }) => {
  return (
    <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
      <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Teko', sans-serif" }}>
        System State
      </h3>
      {currentStep ? (
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Attacker Context:</span>
            <span className="text-green-400 bg-green-900/30 px-2 py-0.5 rounded font-semibold">{currentStep.attacker_context}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Current Tactic:</span>
            <Tooltip
                content={
                    <MitreExplanation
                        term={currentStep.mitre_attack.tactic}
                        type="tactic"
                    />
                }
            >
                <span className="text-cyan-300 cursor-help">{currentStep.mitre_attack.tactic}</span>
            </Tooltip>
          </div>
           <div className="flex justify-between items-center">
            <span className="text-gray-400">Compromised Hosts:</span>
            <span className="text-red-400 font-bold">{totalCompromised}</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Awaiting system state...</p>
      )}
    </div>
  );
};

export default SystemStatePanel;
