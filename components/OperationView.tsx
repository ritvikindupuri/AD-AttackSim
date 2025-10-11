import React, { useState, useEffect } from 'react';
import { ActiveSimulation } from './DashboardPanel';
import ThreatIntelPanel from './ThreatIntelPanel';
import HistoryPanel from './HistoryPanel';
import RightPanel from './RightPanel';
import NetworkGraph from './NetworkGraph';
import DefenseActionPanel from './DefenseActionPanel';
import { marked } from 'marked';


interface OperationViewProps {
  simulation: ActiveSimulation;
  onTakeAction: (action: string) => void;
  isLoadingAction: boolean;
}

const OperationView: React.FC<OperationViewProps> = ({ simulation, onTakeAction, isLoadingAction }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // When new steps are added to the simulation, automatically focus the view on the latest one.
  useEffect(() => {
    setActiveStepIndex(simulation.steps.length - 1);
  }, [simulation.steps]);
  
  const selectStep = (index: number) => {
    // User can always review previous steps
    setActiveStepIndex(index);
  }
  
  const activeStep = simulation.steps[activeStepIndex];
  const isLastStep = activeStepIndex === simulation.steps.length - 1;

  // The attack path shown on the graph should reflect all steps up to the currently viewed one.
  const attackPath = simulation.steps.slice(0, activeStepIndex + 1).map(s => s.target_host_id);

  // Parse the markdown description from the AI
  const parsedDescription = marked.parse(simulation.description);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="text-left p-6 bg-black/30 rounded-lg border border-green-500/20">
            <h2 className="text-3xl font-bold text-white tracking-wider text-center" style={{fontFamily: "'Exo 2', sans-serif"}}>
                {simulation.title}
            </h2>
             <div 
                className="prose prose-invert prose-p:leading-relaxed prose-headings:text-green-400 prose-strong:text-white max-w-none mt-4 text-gray-400"
                dangerouslySetInnerHTML={{ __html: parsedDescription as string }} 
            />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 flex-shrink-0 flex flex-col gap-6">
                <ThreatIntelPanel step={activeStep} />
                <NetworkGraph 
                    topology={simulation.network_topology}
                    targetHostId={activeStep.target_host_id}
                    compromisedHostIds={activeStep.compromised_host_ids || []}
                    attackPath={attackPath}
                />
            </div>
            <div className="lg:w-1/3 flex-shrink-0 flex flex-col gap-6">
                <HistoryPanel 
                    steps={simulation.steps}
                    activeStepIndex={activeStepIndex}
                    setActiveStepIndex={selectStep}
                    revealedSteps={[...Array(simulation.steps.length).keys()]} // All current steps are revealed
                />
                <RightPanel simulation={simulation} activeStepIndex={activeStepIndex} />
            </div>
        </div>

        {/* The Defense Action Panel is only active when viewing the latest step */}
        {isLastStep && (
            <DefenseActionPanel 
                choices={activeStep.defensive_choices}
                onAction={onTakeAction}
                isLoading={isLoadingAction}
            />
        )}
    </div>
  );
};

export default OperationView;