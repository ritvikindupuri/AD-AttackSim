import React, { useState, useCallback } from 'react';
import Header from './Header';
import ControlPanel from './ControlPanel';
import SimulationView from './SimulationView';
import { generateSimulationScenario, SimulationScenario, ExportedScenario } from '../services/aiService';
import { DEFAULT_ENVIRONMENT } from '../lib/defaults';
import { useHistory } from '../context/HistoryContext';

const DashboardPanel: React.FC = () => {
  const [environment, setEnvironment] = useState<string>(DEFAULT_ENVIRONMENT);
  const [attackType, setAttackType] = useState<string>('Kerberoasting');
  const [attackDirectives, setAttackDirectives] = useState<string>('');
  
  const [scenario, setScenario] = useState<SimulationScenario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { addScenarioToHistory } = useHistory();

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setScenario(null);

    try {
      const result = await generateSimulationScenario(environment, attackType, attackDirectives);
      setScenario(result);
      // Add generated scenario to history
      addScenarioToHistory({
        userInput: { environment, attackType, attackDirectives },
        scenarioData: result,
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [environment, attackType, attackDirectives, addScenarioToHistory]);

  const onLoadScenario = (data: ExportedScenario) => {
    setEnvironment(data.userInput.environment);
    setAttackType(data.userInput.attackType);
    setAttackDirectives(data.userInput.attackDirectives);
    setScenario(data.scenarioData);
    setError(null);
  };

  const handleClearScenario = useCallback(() => {
    setScenario(null);
  }, []);

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
          scenario={scenario}
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
        <SimulationView scenario={scenario} isLoading={isLoading} />
      </main>
      <footer className="text-center py-4 text-xs text-gray-600">
        ADversary Simulation Engine. For educational purposes only.
      </footer>
    </div>
  );
};

export default DashboardPanel;