import React from 'react';
import { AlertIcon, WarningIcon, TerminalIcon } from './Icons';

interface SIEMDashboardProps {
  alerts: string[];
}

const getAlertDetails = (alertText: string) => {
    const lowerText = alertText.toLowerCase();
    if (lowerText.includes('critical') || lowerText.includes('compromise') || lowerText.includes('high severity')) {
        return { 
            Icon: AlertIcon, 
            color: 'text-red-400', 
            bgColor: 'bg-red-900/30',
            level: 'CRITICAL' 
        };
    }
    if (lowerText.includes('warning') || lowerText.includes('suspicious') || lowerText.includes('medium severity')) {
        return { 
            Icon: WarningIcon, 
            color: 'text-amber-400', 
            bgColor: 'bg-amber-900/30',
            level: 'WARNING'
        };
    }
    return { 
        Icon: TerminalIcon, 
        color: 'text-sky-400',
        bgColor: 'bg-sky-900/30',
        level: 'INFO' 
    };
};


const SIEMDashboard: React.FC<SIEMDashboardProps> = ({ alerts }) => {
  const reversedAlerts = [...alerts].reverse();

  return (
    <div className="bg-[#1a1a2e]/60 p-4 rounded-lg border border-purple-500/30 backdrop-blur-sm h-[300px] flex flex-col">
        <h3 className="text-lg font-bold text-white mb-3" style={{fontFamily: "'Exo 2', sans-serif"}}>
            SIEM Dashboard
        </h3>
        <div className="flex-grow overflow-y-auto space-y-2 pr-2 font-mono text-xs">
            {reversedAlerts.length === 0 ? (
                <p className="text-sm text-gray-500 animate-pulse mt-4 text-center">No alerts generated yet.</p>
            ) : (
                reversedAlerts.map((alert, index) => {
                    const { Icon, color, bgColor, level } = getAlertDetails(alert);
                    return (
                        <div key={index} className={`flex items-start gap-3 p-2 rounded ${bgColor}`}>
                            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                            <div>
                                <span className={`font-bold mr-2 ${color}`}>[{level}]</span>
                                <span className="text-gray-300">{alert}</span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );
};

export default SIEMDashboard;
