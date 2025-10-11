import React, { useRef } from 'react';
import { ExportedScenario, ScenarioUserInput } from '../services/aiService';
import { PlayIcon, CogIcon, ImportIcon, ExportIcon, TrashIcon } from './Icons';
import Loader from './Loader';
import { ActiveSimulation } from './DashboardPanel';

interface ControlPanelProps {
    // State from parent
    environment: string;
    attackType: string;
    attackDirectives: string;
    isLoading: boolean;
    scenario: ActiveSimulation | null;

    // Setters from parent
    setEnvironment: (value: string) => void;
    setAttackType: (value: string) => void;
    setAttackDirectives: (value: string) => void;
    
    // Handlers
    onGenerate: () => void;
    onLoadScenario: (data: ExportedScenario) => void;
    onClear: () => void;
    setError: (error: string | null) => void;
}

const ATTACK_TYPES = [
    'AD CS Escalation',
    'AS-REP Roasting',
    'BloodHound Analysis',
    'DCSync',
    'Golden Ticket',
    'Group Policy Modification',
    'Kerberoasting',
    'LSASS Memory Dumping',
    'Pass the Hash',
    'Password Spraying',
    'Silver Ticket',
    'ZeroLogon (CVE-2020-1472)',
];

const ControlPanel: React.FC<ControlPanelProps> = ({ 
    environment, setEnvironment,
    attackType, setAttackType,
    attackDirectives, setAttackDirectives,
    isLoading, scenario,
    onGenerate, onLoadScenario, onClear, setError
}) => {
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        if (!scenario) return;

        const userInput: ScenarioUserInput = {
            environment,
            attackType,
            attackDirectives,
        };

        const exportData: ExportedScenario = {
            userInput,
            scenarioData: scenario, // The ActiveSimulation object is compatible with SimulationScenario for export
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `adversary-scenario-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File is not valid text.");

                const data = JSON.parse(text) as ExportedScenario;
                
                // Basic validation
                if (data.userInput && data.scenarioData && data.scenarioData.steps) {
                    onLoadScenario(data);
                    setError(null);
                } else {
                    throw new Error("Invalid ADversary scenario file format.");
                }
            } catch (err: any) {
                setError(err.message || "Failed to import file.");
            }
        };
        reader.onerror = () => {
             setError("Error reading the selected file.");
        };
        reader.readAsText(file);
        
        // Reset file input value to allow re-uploading the same file
        event.target.value = '';
    };

    return (
        <div className="bg-black/30 p-6 rounded-lg border border-green-500/20 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2">
                    <label htmlFor="environment-desc" className="flex items-center gap-2 text-lg font-bold text-white mb-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                        <CogIcon className="w-6 h-6 text-green-400" />
                        <span>Define Environment Configuration</span>
                    </label>
                    <p className="text-xs text-gray-400 mb-3">
                        Use the YAML format below to define the target environment. This structured input is the <strong>source of truth</strong> for the AI and ensures a hyper-realistic simulation.
                    </p>
                    <textarea
                        id="environment-desc"
                        rows={16}
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value)}
                        className="w-full bg-zinc-900/70 border border-green-500/30 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-500 text-xs font-mono"
                        disabled={isLoading}
                    />
                </div>
                
                <div className="flex flex-col gap-4 sticky top-24">
                     <div>
                         <label htmlFor="attack-type" className="block text-sm font-bold text-gray-300 mb-2">
                            1. Select Primary Attack Vector
                        </label>
                        <select
                            id="attack-type"
                            value={attackType}
                            onChange={(e) => setAttackType(e.target.value)}
                            className="w-full bg-zinc-900/70 border border-green-500/30 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-sm"
                             disabled={isLoading}
                        >
                            {ATTACK_TYPES.sort().map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                         <label htmlFor="attack-directives" className="block text-sm font-bold text-gray-300 mb-2">
                            2. Add Attack Directives (Optional)
                        </label>
                         <textarea
                            id="attack-directives"
                            rows={4}
                            value={attackDirectives}
                            onChange={(e) => setAttackDirectives(e.target.value)}
                            className="w-full bg-zinc-900/70 border border-green-500/30 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-500 text-sm"
                            placeholder="e.g., Prioritize stealth and avoid detection. Assume initial access on FIN-WEB01."
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        onClick={onGenerate}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                    >
                        {isLoading && !scenario ? (
                            <>
                                <Loader />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <PlayIcon className="w-5 h-5" />
                                <span>Start Simulation</span>
                            </>
                        )}
                    </button>
                    <div className="grid grid-cols-3 items-center gap-4 mt-2">
                         <button
                            onClick={handleImportClick}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
                         >
                            <ImportIcon className="w-5 h-5" />
                            <span>Import</span>
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isLoading || !scenario}
                            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            <ExportIcon className="w-5 h-5" />
                            <span>Export</span>
                        </button>
                        <button
                            onClick={onClear}
                            disabled={isLoading || !scenario}
                            className="w-full flex items-center justify-center gap-2 bg-red-800/80 hover:bg-red-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            <TrashIcon className="w-5 h-5" />
                            <span>Clear</span>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;