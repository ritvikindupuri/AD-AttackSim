import React from 'react';
import { InfoIcon } from './Icons';
import { NetworkTopology } from '../services/aiService';

interface SystemStatePanelProps {
    topology: NetworkTopology;
    compromisedHostIds: string[];
    securityPosture: string;
}

const SystemStatePanel: React.FC<SystemStatePanelProps> = ({ topology, compromisedHostIds, securityPosture }) => {
    const totalNodes = topology.nodes.length;
    const compromisedCount = compromisedHostIds.length;
    
    const dcNodes = topology.nodes.filter(n => n.type === 'Domain Controller');
    const compromisedDCCount = dcNodes.filter(dc => compromisedHostIds.includes(dc.id)).length;

    const getPostureColor = () => {
        switch (securityPosture.toLowerCase()) {
            case 'critical': return 'text-red-400';
            case 'guarded': return 'text-amber-400';
            case 'secure': return 'text-green-400';
            default: return 'text-gray-300';
        }
    };

    return (
        <div className="bg-[#1a1a2e]/60 p-4 rounded-lg border border-purple-500/30 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2" style={{fontFamily: "'Exo 2', sans-serif"}}>
                <InfoIcon className="w-5 h-5 text-purple-400" />
                System State
            </h3>
            <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Security Posture:</span>
                    <span className={`font-bold ${getPostureColor()}`}>{securityPosture}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Compromised Hosts:</span>
                    <span className="font-bold text-red-400">{compromisedCount} / {totalNodes}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-400">Compromised DCs:</span>
                    <span className="font-bold text-red-400">{compromisedDCCount} / {dcNodes.length}</span>
                </div>
            </div>
        </div>
    );
};

export default SystemStatePanel;