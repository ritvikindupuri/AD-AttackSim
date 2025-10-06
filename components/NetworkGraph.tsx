import React from 'react';
import { SimulationData } from '../services/geminiService';

interface NetworkGraphProps {
  data: SimulationData['network_graph'];
  compromisedHosts: Set<string>;
}

const getCoordinates = (nodes: any[], width: number, height: number) => {
    const coords: { [key: string]: { x: number, y: number } } = {};
    const center = { x: width / 2, y: height / 2 };
    const radius = Math.min(width, height) / 2.5;

    const attacker = nodes.find(n => n.type === 'attacker');
    if (attacker) {
        coords[attacker.id] = { x: 40, y: center.y };
    }
    
    const nonAttackerNodes = nodes.filter(n => n.type !== 'attacker');
    const angleStep = (2 * Math.PI) / nonAttackerNodes.length;

    nonAttackerNodes.forEach((node, i) => {
        const angle = angleStep * i;
        const isDC = node.type === 'dc';
        const currentRadius = isDC ? radius * 1.1 : radius;
        coords[node.id] = {
            x: center.x + currentRadius * Math.cos(angle),
            y: center.y + currentRadius * Math.sin(angle),
        };
    });

    return coords;
}

const NodeIcon = ({ type }: { type: string }) => {
    const iconClass = "w-5 h-5";
    switch(type) {
        case 'attacker': return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${iconClass} text-red-400`}><path fillRule="evenodd" d="M11.982 2.004a.75.75 0 01.036 0l9.25 5.25a.75.75 0 010 1.314l-9.25 5.25a.75.75 0 01-.036 0l-9.25-5.25a.75.75 0 010-1.314l9.25-5.25zM12 4.415L4.702 8.5 12 12.585 19.298 8.5 12 4.415zM2.81 10.316l9.25 5.25a.75.75 0 00.036 0l9.25-5.25a.75.75 0 011.314.657l-9.25 5.25a2.25 2.25 0 01-1.35 0l-9.25-5.25a.75.75 0 011.314-.657zM2.81 15.566l9.25 5.25a.75.75 0 00.036 0l9.25-5.25a.75.75 0 011.314.657l-9.25 5.25a2.25 2.25 0 01-1.35 0l-9.25-5.25a.75.75 0 011.314-.657z" clipRule="evenodd" /></svg>;
        case 'dc': return <svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${iconClass} text-cyan-400`}><path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6h-3a.75.75 0 000 1.5h3v3a.75.75 0 001.5 0v-3h3a.75.75 0 000-1.5h-3V6z" clipRule="evenodd" /></svg>;
        case 'server': return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${iconClass} text-gray-300`}><path d="M.75 3.75A.75.75 0 011.5 3h13.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75H1.5a.75.75 0 01-.75-.75v-1.5z" /><path fillRule="evenodd" d="M1.5 7.5a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v12A2.25 2.25 0 0115.75 22.5H4.5A2.25 2.25 0 012.25 20.25V12a.75.75 0 01-.75-.75V7.5zM4.5 9a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 014.5 9z" clipRule="evenodd" /></svg>;
        case 'user': default: return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${iconClass} text-yellow-400`}><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>;
    }
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data, compromisedHosts }) => {
  const width = 400;
  const height = 250;

  if (!data || !data.nodes || data.nodes.length === 0) {
      return <div className="text-gray-400 text-center p-4">Awaiting network topology...</div>;
  }
  
  const coords = getCoordinates(data.nodes, width, height);

  return (
    <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50 h-[300px]">
        <h3 className="text-lg font-bold text-white mb-2" style={{fontFamily: "'Teko', sans-serif"}}>Network Topology</h3>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
                </marker>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            
            {data.edges.map((edge, i) => {
                const fromNode = coords[edge.from];
                const toNode = coords[edge.to];
                if (!fromNode || !toNode) return null;
                return (
                    <g key={`edge-${i}`}>
                        <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke="#f87171" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    </g>
                );
            })}
            
            {data.nodes.map((node, i) => {
                const { x, y } = coords[node.id] || { x: 0, y: 0 };
                const isCompromised = compromisedHosts.has(node.id);
                return (
                    <g key={`node-${i}`} transform={`translate(${x}, ${y})`}>
                         <title>{`Label: ${node.label}\nType: ${node.type}\nOS: ${node.os}\nIP: ${node.ip}`}</title>
                        <foreignObject x="-30" y="-30" width="60" height="60">
                             <div className="flex flex-col items-center justify-center text-center">
                                <div className={`p-2 bg-gray-800 rounded-full border ${isCompromised ? 'border-red-500 shadow-lg shadow-red-500/50' : 'border-gray-600'}`}>
                                   {isCompromised && <div className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping"></div>}
                                   <NodeIcon type={node.type} />
                                </div>
                                <span className="text-xs text-white font-semibold mt-1 truncate w-full">{node.label}</span>
                             </div>
                        </foreignObject>
                    </g>
                );
            })}
        </svg>
    </div>
  );
};

export default NetworkGraph;
