import React, { useMemo } from 'react';
import { AlertIcon, WarningIcon, TerminalIcon } from './Icons';
import { NetworkNode } from '../services/aiService';

interface SOCEventViewerProps {
  alerts: string[];
  nodes: NetworkNode[];
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

// Helper to find mentioned hostnames in an alert string for added realism
const parseSourceHost = (alertText: string, nodes: NetworkNode[]): string | null => {
    for (const node of nodes) {
        // Check for both the short ID (DC01) and the longer hostname (ADV-DC01)
        if (alertText.includes(node.id) || alertText.includes(node.label)) {
            return node.id;
        }
    }
    return null;
}

const SOCEventViewer: React.FC<SOCEventViewerProps> = ({ alerts, nodes }) => {
  const reversedAlerts = [...alerts].reverse();
  const baseTimestamp = useMemo(() => new Date(), [alerts]); // Lock timestamp to the start of the current alert set

  return (
    <div className="bg-[#1a1a2e]/60 p-4 rounded-lg border border-purple-500/30 backdrop-blur-sm h-[300px] flex flex-col">
        <h3 className="text-lg font-bold text-white mb-3" style={{fontFamily: "'Exo 2', sans-serif"}}>
            SOC Event Viewer
        </h3>
        <div className="flex-grow overflow-y-auto space-y-2 pr-2 font-mono text-xs">
            {reversedAlerts.length === 0 ? (
                <p className="text-sm text-gray-500 animate-pulse mt-4 text-center">No security events generated yet.</p>
            ) : (
                reversedAlerts.map((alert, index) => {
                    const { Icon, color, bgColor, level } = getAlertDetails(alert);
                    const sourceHost = parseSourceHost(alert, nodes);
                    
                    // Create a realistic, progressing timestamp for each event
                    const eventTime = new Date(baseTimestamp.getTime() - index * 1500 - Math.random() * 1000);
                    const formattedTime = eventTime.toISOString().replace('T', ' ').substring(0, 19);

                    return (
                        <div key={index} className={`p-2 rounded ${bgColor}`}>
                            <div className="flex items-start gap-3">
                                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                                <div>
                                    <p className="text-gray-400">{formattedTime}</p>
                                    <p>
                                        <span className={`font-bold mr-2 ${color}`}>[{level}]</span>
                                        {sourceHost && <span className="font-bold text-gray-300 mr-2">SRC:{sourceHost}</span>}
                                        <span className="text-gray-300">{alert}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );
};

export default SOCEventViewer;