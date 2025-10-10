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

const getNodeColor = (type: string, isCompromised: boolean) => {
  if (isCompromised) return 'bg-red-600 border-red-400';
  switch (type) {
    case 'Domain Controller': return 'bg-purple-600 border-purple-400';
    case 'Member Server': return 'bg-blue-600 border-blue-400';
    case 'Workstation': return 'bg-gray-600 border-gray-400';
    case 'Firewall': return 'bg-green-700 border-green-500';
    case 'Internet': return 'bg-sky-600 border-sky-400';
    default: return 'bg-gray-700 border-gray-500';
  }
};

const getNodeIcon = (type: string) => {
    const iconProps = { className: "w-4 h-4 mr-2 flex-shrink-0" };
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
    const tiers: { [key: string]: any[] } = {
      'Internet': [], 'Firewall': [], 'Member Server': [], 'Domain Controller': [], 'Workstation': []
    };
    
    topology.nodes.forEach(node => {
      if (tiers[node.type]) {
        tiers[node.type].push(node);
      }
    });

    const tierOrder = ['Internet', 'Firewall', 'Member Server', 'Domain Controller', 'Workstation'];
    let currentY = 10;
    const tierGap = 80 / (tierOrder.filter(t => tiers[t].length > 0).length || 1);


    tierOrder.forEach(tierName => {
      const nodesInTier = tiers[tierName];
      if (nodesInTier.length > 0) {
        const tierWidth = (nodesInTier.length - 1) * 18;
        let currentX = 50 - tierWidth / 2;
        nodesInTier.forEach(node => {
          positions[node.id] = { x: currentX, y: currentY };
          currentX += 18;
        });
        currentY += tierGap;
      }
    });
    return positions;
  }, [topology.nodes]);

  return (
    <div className="bg-black/40 p-4 rounded-lg border border-green-500/20 backdrop-blur-sm h-[400px] relative overflow-hidden">
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
                        stroke={isAttackPathEdge ? '#f87171' : 'rgba(107, 114, 128, 0.5)'}
                        strokeWidth={isAttackPathEdge ? 2 : 1.5}
                        className="transition-all duration-500"
                    />
                );
            })}
        </svg>

        {topology.nodes.map(node => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isCompromised = compromisedHostIds.includes(node.id);
            const isTarget = node.id === targetHostId;

            return (
                <Tooltip key={node.id} content={<div className="text-xs p-1"><p className="font-bold">{node.label}</p><p>{node.os}</p></div>}>
                    <div
                        className={`absolute flex items-center justify-center px-3 py-2 rounded-md border-2 text-white text-xs font-bold transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 ${getNodeColor(node.type, isCompromised)} ${isTarget ? 'ring-4 ring-amber-400 scale-110' : ''}`}
                        style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: 1, minWidth: '100px' }}
                    >
                        {getNodeIcon(node.type)}
                        <span className="truncate">{node.label}</span>
                    </div>
                </Tooltip>
            );
        })}
    </div>
  );
};

export default NetworkGraph;