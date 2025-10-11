import React, { useState, useCallback } from 'react';
import Header from './Header';
import ControlPanel from './ControlPanel';
import SimulationView from './SimulationView';
import { startInitialSimulation, generateNextAttackStep, SimulationScenario, ExportedScenario, AttackStep, NetworkTopology } from '../services/aiService';
import { DEFAULT_ENVIRONMENT } from '../lib/defaults';
import { useHistory } from '../context/HistoryContext';

export interface ActiveSimulation {
  title: string;
  description: string;
  network_topology: NetworkTopology;
  steps: AttackStep[];
}

const DashboardPanel: React.FC = () => {
  const [environment, setEnvironment] = useState<string>(DEFAULT_ENVIRONMENT);
  const [attackType, setAttackType] = useState<string>('Kerberoasting');
  const [attackDirectives, setAttackDirectives] = useState<string>('');
  
  const [simulation, setSimulation] = useState<ActiveSimulation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { addScenarioToHistory } = useHistory();

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSimulation(null);

    try {
      const result = await startInitialSimulation(environment, attackType, attackDirectives);
      setSimulation({
        title: result.title,
        description: result.description,
        network_topology: result.network_topology,
        steps: [result.first_step],
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [environment, attackType, attackDirectives]);
  
  const handleTakeAction = useCallback(async (action: string) => {
      if (!simulation) return;
      setIsLoading(true);
      setError(null);
      try {
        const nextStep = await generateNextAttackStep(
          simulation.steps,
          action,
          environment
        );
        setSimulation(prev => prev ? { ...prev, steps: [...prev.steps, nextStep] } : null);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
  }, [simulation, environment]);

  const onLoadScenario = (data: ExportedScenario) => {
    setEnvironment(data.userInput.environment);
    setAttackType(data.userInput.attackType);
    setAttackDirectives(data.userInput.attackDirectives);
    setSimulation(data.scenarioData); // The loaded scenario is now the active simulation
    setError(null);
  };

  const handleClearScenario = useCallback(() => {
    if (simulation) {
      // Save the completed interactive scenario to history before clearing
      const scenarioToSave: SimulationScenario = {
        title: simulation.title,
        description: simulation.description,
        network_topology: simulation.network_topology,
        steps: simulation.steps,
      };
      addScenarioToHistory({
        userInput: { environment, attackType, attackDirectives },
        scenarioData: scenarioToSave,
      });
    }
    setSimulation(null);
  }, [simulation, addScenarioToHistory, environment, attackType, attackDirectives]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white selection:bg-green-800 selection:text-white">
      <Header onLoadScenario={onLoadScenario} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <ControlPanel
          environment={environment}
          setEnvironment={setEnvironment}
          attackType={attackType}
          setAttackType={setAttackType}
          attackDirectives={attackDirectives}
          setAttackDirectives={setAttackDirectives}
          isLoading={isLoading}
          scenario={simulation}
          onGenerate={handleGenerate}
          onLoadScenario={onLoadScenario}
          setError={setError}
          onClear={handleClearScenario}
        />
        {error && (
            <div className="p-4 bg-red-900/50 border border-red-500/60 rounded-lg text-red-300 text-center">
                <strong>Error:</strong> {error}
            </div>
        )}
        <SimulationView 
          simulation={simulation} 
          isLoading={isLoading}
          onTakeAction={handleTakeAction} 
        />
      </main>
      <footer className="text-center py-4 text-xs text-gray-600">
        ADversary Simulation Engine. For educational purposes only.
      </footer>
    </div>
  );
};

export default DashboardPanel;