import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { ExportedScenario } from '../services/aiService';

interface HistoryContextType {
  history: ExportedScenario[];
  addScenarioToHistory: (scenario: ExportedScenario) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useLocalStorage<ExportedScenario[]>('adversary_history', []);

  const addScenarioToHistory = (scenario: ExportedScenario) => {
    // Avoid duplicates and limit history size
    const newHistory = [scenario, ...history.filter(h => h.scenarioData.title !== scenario.scenarioData.title)].slice(0, 20);
    setHistory(newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider value={{ history, addScenarioToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
