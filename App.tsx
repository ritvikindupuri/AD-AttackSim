import React, { useState, useMemo } from 'react';
import ControlPanel, { AttackScenario } from './components/ControlPanel';
import Header from './components/Header';
import RightPanel from './components/RightPanel';
import OperationView from './components/OperationView';
import { generateSimulationScenario, SimulationData, AttackStep } from './services/geminiService';
import { PraetorianLogo } from './components/Icons';
import DefensePanel from './components/DefensePanel';

const App: React.FC = () => {
  const [environment, setEnvironment] = useState<string>('');
  const [scenario, setScenario] = useState<AttackScenario>('Kerberoasting');
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleGenerate = async () => {
    if (!environment.trim()) {
      setError("Please describe the AD environment first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSimulationData(null);
    setCurrentStepIndex(0);

    try {
      const data = await generateSimulationScenario(environment, scenario);
      setSimulationData(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNextStep = () => {
      if (simulationData && currentStepIndex < simulationData.attack_steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
      }
  }

  const handlePreviousStep = () => {
      if (currentStepIndex > 0) {
          setCurrentStepIndex(prev => prev - 1);
      }
  }

  const handleGoToStep = (index: number) => {
      if (simulationData && index >= 0 && index < simulationData.attack_steps.length) {
          setCurrentStepIndex(index);
      }
  }
  
  const { compromisedHosts, allEvents, currentStep } = useMemo(() => {
    if (!simulationData) {
      return { compromisedHosts: new Set<string>(), allEvents: [], currentStep: null };
    }
    const hosts = new Set<string>();
    const events: AttackStep['generated_events'] = [];
    
    simulationData.attack_steps.slice(0, currentStepIndex + 1).forEach(step => {
        step.newly_compromised_hosts.forEach(hostId => hosts.add(hostId));
        events.push(...step.generated_events);
    });

    return {
        compromisedHosts: hosts,
        allEvents: events,
        currentStep: simulationData.attack_steps[currentStepIndex]
    };

  }, [simulationData, currentStepIndex]);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <ControlPanel
              environment={environment}
              setEnvironment={setEnvironment}
              scenario={scenario}
              setScenario={setScenario}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              error={error}
              setError={setError}
            />
            {simulationData && (
                <DefensePanel recommendations={simulationData.defense_recommendations} />
            )}
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                {simulationData ? (
                    <OperationView 
                        data={simulationData}
                        currentStep={currentStep}
                        currentStepIndex={currentStepIndex}
                        onNextStep={handleNextStep}
                        onPreviousStep={handlePreviousStep}
                        onGoToStep={handleGoToStep}
                    />
                ) : (
                    <div className="bg-black/30 rounded-md border border-cyan-500/20 p-6 shadow-inner-cyan h-full flex items-center justify-center">
                       <div className="text-center">
                        <PraetorianLogo className="h-24 w-24 text-cyan-400/30 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white tracking-wider" style={{fontFamily: "'Teko', sans-serif"}}>
                            PRAETORIAN CYBER RANGE
                        </h2>
                        <p className="text-gray-400">
                            Configure engagement parameters and deploy a scenario to begin.
                        </p>
                       </div>
                    </div>
                )}
              </div>
              <div className="xl:col-span-1">
                <RightPanel 
                    data={simulationData} 
                    currentStep={currentStep}
                    compromisedHosts={compromisedHosts}
                    allEvents={allEvents}
                />
              </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
