import React from 'react';
import { ActiveSimulation } from './DashboardPanel';
import SystemStatePanel from './SystemStatePanel';
import AdversaryEventLog from './SIEMDashboard';

interface RightPanelProps {
  simulation: ActiveSimulation;
  activeStepIndex: number;
}

const RightPanel: React.FC<RightPanelProps> = ({ simulation, activeStepIndex }) => {
  const activeStep = simulation.steps[activeStepIndex];
  const allAlerts = simulation.steps.slice(0, activeStepIndex + 1).flatMap(s => s.system_alerts || []);

  return (
    <div className="space-y-6">
      <SystemStatePanel 
        topology={simulation.network_topology}
        compromisedHostIds={activeStep.compromised_host_ids || []}
        securityPosture={activeStep.security_posture}
      />
      <AdversaryEventLog alerts={allAlerts} nodes={simulation.network_topology.nodes} />
    </div>
  );
};

export default RightPanel;