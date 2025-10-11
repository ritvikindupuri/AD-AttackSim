import React from 'react';
import OperationView from './OperationView';
import { EmptyStateIcon } from './Icons';
import { ActiveSimulation } from './DashboardPanel';

interface SimulationViewProps {
  simulation: ActiveSimulation | null;
  isLoading: boolean;
  onTakeAction: (action: string) => void;
}

const SimulationView: React.FC<SimulationViewProps> = ({ simulation, isLoading, onTakeAction }) => {
  if (isLoading && !simulation) {
    return (
      <div className="text-center p-8 bg-black/20 rounded-lg border border-green-500/20">
        <h2 className="text-2xl font-bold text-green-400">Generating Attack Scenario...</h2>
        <p className="text-gray-400">The AI is crafting a realistic simulation. This may take a moment.</p>
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="text-center p-8 bg-black/20 rounded-lg border border-dashed border-green-500/30">
        <EmptyStateIcon className="w-12 h-12 mx-auto text-green-500/50 mb-4" />
        <h2 className="text-2xl font-bold text-gray-300">Awaiting Simulation Parameters</h2>
        <p className="text-gray-500">Configure and start a new simulation above to begin.</p>
      </div>
    );
  }

  return <OperationView simulation={simulation} onTakeAction={onTakeAction} isLoadingAction={isLoading} />;
};

export default SimulationView;