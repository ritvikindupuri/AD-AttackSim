import React from 'react';
import OperationView from './OperationView';
import { SimulationScenario } from '../services/aiService';
import { SparklesIcon } from './Icons';

interface SimulationViewProps {
  scenario: SimulationScenario | null;
  isLoading: boolean;
}

const SimulationView: React.FC<SimulationViewProps> = ({ scenario, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center p-8 bg-black/20 rounded-lg border border-green-500/20">
        <h2 className="text-2xl font-bold text-green-400">Generating Attack Scenario...</h2>
        <p className="text-gray-400">The AI is crafting a realistic simulation. This may take a moment.</p>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="text-center p-8 bg-black/20 rounded-lg border border-dashed border-green-500/30">
        <SparklesIcon className="w-12 h-12 mx-auto text-green-500/50 mb-4" />
        <h2 className="text-2xl font-bold text-gray-300">Awaiting Simulation Parameters</h2>
        <p className="text-gray-500">Configure and start a new simulation above to begin.</p>
      </div>
    );
  }

  return <OperationView scenario={scenario} />;
};

export default SimulationView;
