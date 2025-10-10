import React from 'react';
import { NetworkTopology, Node as NodeType } from '../services/aiService';
import { ShieldIcon, TerminalIcon, InfoIcon } from './Icons';
import Tooltip from './Tooltip';

const ICONS: { [key: string]: React.ReactNode } = {
    'Domain Controller': <ShieldIcon className="w-8 h-8 text-green-400" />,
    'File Server': <InfoIcon className="w-8 h-8 text-cyan-400" />,
    'Workstation': <TerminalIcon className="w-8 h-8 text-gray-400" />,
    'Web Server': <TerminalIcon className="w-8 h-8 text-purple-400" />,
    'Database Server': <InfoIcon className="w-8 h-8 text-amber-400" />,
};

interface NodeProps {
    node: NodeType;
    position: { x: number, y: number };
    isTarget: boolean;
    isCompromised: boolean;
}

const Node: React.FC<NodeProps> = ({ node, position, isTarget, isCompromised }) => {
    const stateClasses = isCompromised 
        ? 'bg-red-900/50 border-red-500' 
        : isTarget 
        ? 'bg-amber-900/50 border-amber-500 animate-pulse' 
        : 'bg-gray-800/80 border-green-500/50 group-hover:bg-green-900/50 group-hover:border-green-400';
    
    const icon = ICONS[node.type] || <TerminalIcon className="w-8 h-8 text-gray-400" />;

    return (
        <div 
            className="absolute flex flex-col items-center group transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
        >
            <Tooltip content={
                <div className="text-left">
                    <p className="font-bold">{node.hostname}</p>
                    <p className="text-xs text-gray-400">{node.type}</p>
                    <p className="text-xs font-mono">{node.ip_address}</p>
                </div>
            }>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stateClasses}`}>
                    {icon}
                </div>
            </Tooltip>
            <div className="text-center mt-1">
                <p className="font-bold text-sm text-white truncate w-24">{node.hostname}</p>
            </div>
        </div>
    );
};

interface NetworkGraphProps {
    topology: NetworkTopology;
    targetHostId?: string;
    compromisedHostIds: string[];
    attackPath: string[];
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ topology, targetHostId, compromisedHostIds, attackPath }) => {
    const { nodes, edges } = topology;
    const nodeCount = nodes.length;
    const radius = 40; // Percentage of the container radius
    const center = { x: 50, y: 50 };

    const nodePositions = nodes.reduce((acc, node, i) => {
        const angle = (i / nodeCount) * 2 * Math.PI - Math.PI / 2; // Start from top
        acc[node.id] = {
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle),
        };
        return acc;
    }, {} as { [key: string]: { x: number; y: number } });

    const getNodePos = (id: string) => nodePositions[id] || { x: 0, y: 0 };

    return (
        <div className="bg-black/40 p-6 rounded-lg border border-green-500/20 backdrop-blur-sm h-[400px] overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Exo 2', sans-serif" }}>Network Topology</h3>
            <div className="relative w-full h-full">
                <svg width="100%" height="100%" className="absolute inset-0">
                    {edges.map((edge, i) => {
                         const sourcePos = getNodePos(edge.source);
                         const targetPos = getNodePos(edge.target);
                         return (
                            <line 
                                key={i} 
                                x1={`${sourcePos.x}%`} y1={`${sourcePos.y}%`}
                                x2={`${targetPos.x}%`} y2={`${targetPos.y}%`}
                                className="stroke-green-500/20" strokeWidth="2" 
                            />
                         );
                    })}
                     {attackPath.map((nodeId, i) => {
                        if (i === 0) return null;
                        const sourcePos = getNodePos(attackPath[i-1]);
                        const targetPos = getNodePos(nodeId);
                        return (
                             <line 
                                key={`attack-${i}`} 
                                x1={`${sourcePos.x}%`} y1={`${sourcePos.y}%`}
                                x2={`${targetPos.x}%`} y2={`${targetPos.y}%`}
                                className="stroke-red-500/70" strokeWidth="3" 
                            />
                        );
                     })}
                </svg>

                {nodes.map(node => (
                    <Node 
                        key={node.id} 
                        node={node}
                        position={getNodePos(node.id)}
                        isTarget={node.id === targetHostId}
                        isCompromised={compromisedHostIds.includes(node.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default NetworkGraph;