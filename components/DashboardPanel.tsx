import React, { useState } from 'react';
import ControlPanel from './ControlPanel';
import SimulationView from './SimulationView';
import { SimulationScenario, ExportedScenario, generateSimulationScenario } from '../services/aiService';

const initialEnvironmentConfig = `# Describe your Active Directory environment using this format.
# This configuration is the ONLY source of truth for the AI.

company_profile:
  name: Fincorp
  industry: Financial Services
  size: Small Business (approx. 50 employees)

domain_controllers:
  - hostname: FIN-DC01
    os: Windows Server 2019

member_servers:
  - hostname: FIN-FS01
    os: Windows Server 2022
    role: File Server
  - hostname: FIN-WEB01
    os: Windows Server 2019
    role: Web Server (IIS)

workstations:
  - count: 20 # Approximate number
    os: Windows 11 Enterprise
    user_profile: Standard corporate users

security_posture:
  - EDR: Deployed (CrowdStrike Falcon)
  - Antivirus: Windows Defender
  - Firewall: Standard perimeter firewall
  - Policies: Strong password policy enforced, LAPS not implemented.
`;


const DashboardPanel: React.FC = () => {
  const [scenario, setScenario] = useState<SimulationScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State lifted from ControlPanel for import/export functionality
  const [environment, setEnvironment] = useState<string>(initialEnvironmentConfig);
  const [attackType, setAttackType] = useState<string>('Kerberoasting');
  const [attackDirectives, setAttackDirectives] = useState<string>('');


  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setScenario(null);
    try {
        const result = await generateSimulationScenario(environment, attackType, attackDirectives);
        setScenario(result);
    } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleLoadScenario = (data: ExportedScenario) => {
    setEnvironment(data.userInput.environment);
    setAttackType(data.userInput.attackType);
    setAttackDirectives(data.userInput.attackDirectives);
    setScenario(data.scenarioData);
    setError(null);
    setIsLoading(false);
  };


  return (
    <div className="space-y-6">
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
        onLoadScenario={handleLoadScenario}
        setError={setError}
      />
      {error && (
        <div className="bg-red-900/50 border border-red-500/60 text-red-300 p-4 rounded-lg">
          <p className="font-bold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      <SimulationView 
        scenario={scenario} 
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardPanel;
