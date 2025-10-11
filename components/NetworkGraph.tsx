import React from 'react';
import { NetworkTopology } from '../services/aiService';
import Tooltip from './Tooltip';
import { DomainControllerIcon, ServerIcon, WorkstationIcon, FirewallIcon, CloudIcon } from './Icons';

interface NetworkGraphProps {
  topology: NetworkTopology;
  targetHostId: string;
  compromisedHostIds: string[];
  attackPath: string[];
}

const getNodeStyle = (isCompromised: boolean) => {
  if (isCompromised) {
    // Red for compromised nodes, matching the reference image's style
    return 'bg-red-900/40 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  }
  // Green for secure nodes
  return 'bg-green-900/30 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]';
};

const getNodeIcon = (type: string) => {
    const iconProps = { className: "w-9 h-9" }; // Sized to fit within the new circular nodes
    switch (type) {
        case 'Domain Controller': return <DomainControllerIcon {...iconProps} />;
        case 'Member Server': return <ServerIcon {...iconProps} />;
        case 'Workstation': return <WorkstationIcon {...iconProps} />;
        case 'Firewall': return <FirewallIcon {...iconProps} />;
        case 'Internet': return <CloudIcon {...iconProps} />;
        default: return null;
    }
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({ topology, targetHostId, compromisedHostIds, attackPath }) => {
  const nodePositions = React.useMemo(() => {
    const positions: { [key: string]: { x: number; y: number } } = {};
    const numNodes = topology.nodes.length;
    if (numNodes === 0) return {};

    const radius = 38; // Percentage from center to keep nodes from hitting the edge
    const centerX = 50;
    const centerY = 50;

    // Arrange nodes in a circle for a clean, professional layout
    topology.nodes.forEach((node, i) => {
        const angle = (i / numNodes) * 2 * Math.PI;
        // Start angle at top (-PI/2) for better visual balance
        const adjustedAngle = angle - Math.PI / 2;
        const x = centerX + radius * Math.cos(adjustedAngle);
        const y = centerY + radius * Math.sin(adjustedAngle);
        positions[node.id] = { x, y };
    });

    return positions;
  }, [topology.nodes]);

  return (
    <div className="bg-black/40 p-4 rounded-lg border border-green-500/20 backdrop-blur-sm h-[480px] relative overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-2" style={{fontFamily: "'Exo 2', sans-serif"}}>Network Topology</h3>
        <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
            {topology.edges.map((edge, index) => {
                const fromNode = nodePositions[edge.from];
                const toNode = nodePositions[edge.to];
                if (!fromNode || !toNode) return null;

                const isAttackPathEdge = attackPath.includes(edge.from) && attackPath.includes(edge.to) && Math.abs(attackPath.indexOf(edge.from) - attackPath.indexOf(edge.to)) === 1;

                return (
                    <line
                        key={index}
                        x1={`${fromNode.x}%`} y1={`${fromNode.y}%`}
                        x2={`${toNode.x}%`} y2={`${toNode.y}%`}
                        stroke={isAttackPathEdge ? '#ef4444' : 'rgba(34, 197, 94, 0.6)'} // Red for attack path, Green for normal connections
                        strokeWidth={isAttackPathEdge ? 2 : 1.5}
                        className="transition-all duration-500"
                    />
                );
            })}
        </svg>

        {topology.nodes.map(node => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isCompromised = compromisedHostIds.includes(node.id) || node.id === targetHostId;

            return (
                 <div
                    key={node.id}
                    className="absolute"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', zIndex: 1 }}
                >
                    <Tooltip content={<div className="text-xs p-1"><p className="font-bold">{node.label} ({node.id})</p><p>{node.type}</p><p>{node.os}</p></div>}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${getNodeStyle(isCompromised)}`}>
                            {getNodeIcon(node.type)}
                        </div>
                    </Tooltip>
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-28 text-center text-xs font-semibold text-gray-300 truncate" title={node.label}>
                        {node.label}
                    </div>
                </div>
            );
        })}
    </div>
  );
};

export default NetworkGraph;