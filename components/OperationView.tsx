import React, { useState, useEffect } from 'react';
import { SimulationScenario } from '../services/aiService';
import ThreatIntelPanel from './ThreatIntelPanel';
import HistoryPanel from './HistoryPanel';
import RightPanel from './RightPanel';
import NetworkGraph from './NetworkGraph';
import { PlayIcon } from './Icons';
import Loader from './Loader';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';


interface OperationViewProps {
  scenario: SimulationScenario;
}

const OperationView: React.FC<OperationViewProps> = ({ scenario }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([0]);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    setActiveStepIndex(0);
    setRevealedSteps([0]);
    setIsPlaying(true);
  }, [scenario]);

  useEffect(() => {
    if (!isPlaying || activeStepIndex >= scenario.steps.length - 1) {
      if (activeStepIndex >= scenario.steps.length - 1) setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      handleNextStep();
    }, 4000);

    return () => clearTimeout(timer);
  }, [activeStepIndex, isPlaying, scenario.steps.length]);


  const handleNextStep = () => {
    if (activeStepIndex < scenario.steps.length - 1) {
      const nextStep = activeStepIndex + 1;
      setActiveStepIndex(nextStep);
      if (!revealedSteps.includes(nextStep)) {
        setRevealedSteps(prev => [...prev, nextStep].sort((a,b) => a-b));
      }
    } else {
      setIsPlaying(false);
    }
  };

  const selectStep = (index: number) => {
    if (revealedSteps.includes(index)) {
      setActiveStepIndex(index);
      setIsPlaying(false);
    }
  }
  
  const activeStep = scenario.steps[activeStepIndex];
  const isComplete = revealedSteps.length === scenario.steps.length && activeStepIndex === scenario.steps.length - 1;
  const compromisedHostIds = activeStep.compromised_host_ids || [];
  const attackPath = scenario.steps.slice(0, activeStepIndex + 1).map(s => s.target_host_id);

  // Parse the markdown description from the AI
  const parsedDescription = marked.parse(scenario.description);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="text-left p-6 bg-black/30 rounded-lg border border-green-500/20">
            <h2 className="text-3xl font-bold text-white tracking-wider text-center" style={{fontFamily: "'Exo 2', sans-serif"}}>
                {scenario.title}
            </h2>
             <div 
                className="prose prose-invert prose-headings:text-green-400 prose-strong:text-white max-w-none mt-4 text-gray-400"
                dangerouslySetInnerHTML={{ __html: parsedDescription as string }} 
            />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 flex-shrink-0 flex flex-col gap-6">
                <ThreatIntelPanel step={activeStep} />
                <NetworkGraph 
                    topology={scenario.network_topology}
                    targetHostId={activeStep.target_host_id}
                    compromisedHostIds={compromisedHostIds}
                    attackPath={attackPath}
                />
            </div>
            <div className="lg:w-1/3 flex-shrink-0 flex flex-col gap-6">
                <HistoryPanel 
                    steps={scenario.steps}
                    activeStepIndex={activeStepIndex}
                    setActiveStepIndex={selectStep}
                    revealedSteps={revealedSteps}
                />
                <RightPanel scenario={scenario} activeStepIndex={activeStepIndex} />
            </div>
        </div>

        <div className="mt-6 flex justify-center">
            {isComplete ? (
                 <div className="w-full md:w-1/2 lg:w-1/3 text-center font-bold py-3 px-8 rounded-lg bg-green-500/20 text-green-300">
                    Simulation Complete
                </div>
            ) : (
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
                >
                    {isPlaying ? (
                        <>
                            <Loader size="h-5 w-5" />
                            <span>AUTORUNNING... (PAUSE)</span>
                        </>
                    ) : (
                        <>
                            <PlayIcon className="w-5 h-5" />
                            <span>RESUME AUTORUN</span>
                        </>
                    )}
                </button>
            )}
        </div>
    </div>
  );
};

export default OperationView;