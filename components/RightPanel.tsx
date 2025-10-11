import React from 'react';
import { SimulationScenario } from '../services/aiService';
import SystemStatePanel from './SystemStatePanel';
import SOCEventViewer from './SIEMDashboard';

interface RightPanelProps {
  scenario: SimulationScenario;
  activeStepIndex: number;
}

const RightPanel: React.FC<RightPanelProps> = ({ scenario, activeStepIndex }) => {
  const activeStep = scenario.steps[activeStepIndex];
  const allAlerts = scenario.steps.slice(0, activeStepIndex + 1).flatMap(s => s.system_alerts);

  return (
    <div className="space-y-6">
      <SystemStatePanel 
        topology={scenario.network_topology}
        compromisedHostIds={activeStep.compromised_host_ids}
        securityPosture={activeStep.security_posture}
      />
      <SOCEventViewer alerts={allAlerts} nodes={scenario.network_topology.nodes} />
    </div>
  );
};

export default RightPanel;