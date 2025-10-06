import React, { useState, useEffect } from 'react';
import { SimulationData, AttackStep } from '../services/geminiService';
import useTypewriter from '../hooks/useTypewriter';
import { MitreIcon, PlayIcon, ShieldIcon, ChevronRightIcon } from './Icons';
import Tooltip from './Tooltip';
import MitreExplanation from './MitreExplanation';
import Loader from './Loader';

interface OperationViewProps {
  data: SimulationData;
  currentStep: AttackStep | null;
  currentStepIndex: number;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onGoToStep: (index: number) => void;
}

const OperationView: React.FC<OperationViewProps> = ({ data, currentStep, currentStepIndex, onNextStep, onPreviousStep, onGoToStep }) => {
    const [isExecuting, setIsExecuting] = useState(false);
    const [showOutput, setShowOutput] = useState(false);
    
    const typedOutput = useTypewriter(showOutput ? currentStep?.output || '' : '', 10);
    const isLastStep = currentStepIndex === data.attack_steps.length - 1;

    // Derived states for button logic
    const isTypewriterFinished = showOutput && typedOutput.length === (currentStep?.output || '').length;
    const isExecutionInProgress = isExecuting && !isTypewriterFinished;

    useEffect(() => {
        setIsExecuting(false);
        setShowOutput(false);
    }, [currentStepIndex]);

    const handleExecute = () => {
        setIsExecuting(true);
        setShowOutput(true);
    };

    if (!currentStep) return null;

    return (
        <div className="bg-black/30 rounded-md border border-cyan-500/20 p-6 shadow-inner-cyan flex flex-col h-full">
            {/* Step Navigator */}
            <div className="flex items-center mb-6">
                {data.attack_steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    let buttonClasses = 'w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300';
                    if (isCurrent) {
                        buttonClasses += ' bg-cyan-500 text-white ring-2 ring-offset-2 ring-offset-gray-900 ring-cyan-400';
                    } else if (isCompleted) {
                        buttonClasses += ' bg-gray-700 hover:bg-gray-600 text-gray-300';
                    } else {
                        buttonClasses += ' border border-gray-700 text-gray-600 cursor-not-allowed';
                    }

                    return (
                        <React.Fragment key={index}>
                            <button
                                onClick={() => onGoToStep(index)}
                                disabled={index > currentStepIndex || isExecutionInProgress} // Disable during execution
                                className={buttonClasses}
                                aria-label={`Go to step ${index + 1}: ${step.title}`}
                                title={`Step ${index + 1}: ${step.title}`}
                            >
                                {index + 1}
                            </button>
                            {index < data.attack_steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 transition-colors duration-500 ${isCompleted ? 'bg-cyan-500' : 'bg-gray-700'}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="flex-grow">
                <p className="text-sm text-cyan-400 font-mono">STEP {currentStepIndex + 1} OF {data.attack_steps.length}</p>
                <h2 className="text-3xl font-bold text-white tracking-wider mb-2" style={{ fontFamily: "'Teko', sans-serif" }}>
                    {currentStep.title}
                </h2>
                <p className="text-gray-300 mb-6 text-base">{currentStep.description}</p>
                
                <div className="font-mono text-sm mb-4">
                    <label className="text-gray-400 block mb-1">Command to Execute:</label>
                    <div className="bg-gray-900 p-3 rounded-md border border-gray-700 text-green-400">
                        {`> ${currentStep.command.code}`}
                    </div>
                </div>

                <div className="font-mono text-sm">
                    <label className="text-gray-400 block mb-1">Terminal Output:</label>
                    <div className="bg-black/50 p-3 rounded-md border border-gray-700 min-h-[150px] text-gray-200 whitespace-pre-wrap">
                        {typedOutput}
                        {isExecuting && !isTypewriterFinished && <span className="animate-ping">_</span>}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-between gap-4 items-center">
                 <Tooltip
                    content={
                        <MitreExplanation
                            term={`${currentStep.mitre_attack.technique_id}: ${currentStep.mitre_attack.technique_name}`}
                            type="technique"
                        />
                    }
                 >
                    <div className="text-sm text-gray-400 flex items-center gap-2 border border-gray-700/50 bg-gray-900/40 px-3 py-1.5 rounded-md cursor-help">
                        <MitreIcon className="w-4 h-4 text-cyan-400" />
                        <span>{currentStep.mitre_attack.technique_id}</span>
                    </div>
                 </Tooltip>
                 
                 <div className="flex items-center gap-4">
                    <button
                        onClick={onPreviousStep}
                        disabled={currentStepIndex === 0 || isExecutionInProgress} // Disable during execution
                        className="text-gray-300 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:text-gray-600 disabled:cursor-not-allowed"
                    >
                        &larr; Previous
                    </button>
                    
                    {(() => {
                        if (isExecutionInProgress) {
                            return (
                                <button
                                    disabled
                                    className="flex items-center justify-center gap-2 w-[150px] bg-gray-700 cursor-wait text-white font-bold py-2 px-6 rounded-lg transition-all"
                                >
                                    <Loader size="w-5 h-5" />
                                    <span>Executing...</span>
                                </button>
                            );
                        }
                        
                        if (isExecuting && isTypewriterFinished) {
                            if (isLastStep) {
                                return (
                                    <div className="flex items-center gap-2 text-green-400 font-bold py-2 px-6 rounded-lg border border-green-500/50 bg-green-900/30">
                                        <ShieldIcon className="w-5 h-5" />
                                        OPERATION COMPLETE
                                    </div>
                                );
                            } else {
                                return (
                                    <button
                                        onClick={onNextStep}
                                        className="flex items-center justify-center gap-2 w-[150px] bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        <span>Next Step</span>
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>
                                );
                            }
                        }

                        // Default: Not yet executed
                        return (
                            <button
                                onClick={handleExecute}
                                className="flex items-center justify-center gap-2 w-[150px] bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                                <span>Execute</span>
                                <PlayIcon className="w-5 h-5"/>
                            </button>
                        );
                    })()}
                 </div>
            </div>
        </div>
    );
};

export default OperationView;