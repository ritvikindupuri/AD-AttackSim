import React from 'react';
import { SimulationData, AttackStep } from '../services/geminiService';
import LiveEventFeed from './LiveEventFeed';
import NetworkGraph from './NetworkGraph';
import SystemStatePanel from './SystemStatePanel';

interface RightPanelProps {
  data: SimulationData | null;
  currentStep: AttackStep | null;
  compromisedHosts: Set<string>;
  allEvents: AttackStep['generated_events'];
}

const RightPanel: React.FC<RightPanelProps> = ({ data, currentStep, compromisedHosts, allEvents }) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {data && currentStep ? (
        <>
          <NetworkGraph data={data.network_graph} compromisedHosts={compromisedHosts} />
          <SystemStatePanel currentStep={currentStep} totalCompromised={compromisedHosts.size} />
          <LiveEventFeed events={allEvents} />
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center bg-black/30 rounded-md border border-cyan-500/20 p-4 shadow-inner-cyan h-full">
          <div className="text-center text-gray-400">
            <h3 className="text-2xl font-bold text-white mb-2" style={{fontFamily: "'Teko', sans-serif"}}>Awaiting Deployment</h3>
            <p>Deploy a scenario to begin the operation.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
