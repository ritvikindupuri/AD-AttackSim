import React, { useState, useEffect } from 'react';
import { AlertIcon, WarningIcon, TerminalIcon } from './Icons';
import useTypewriter from '../hooks/useTypewriter';

interface LiveEventFeedProps {
    alerts: string[];
}

const LiveEventFeed: React.FC<LiveEventFeedProps> = ({ alerts }) => {
    const [displayedAlerts, setDisplayedAlerts] = useState<string[]>([]);

    useEffect(() => {
        setDisplayedAlerts([]); // Clear on new alerts
        
        // FIX: Use `number` for setTimeout return type in browser environment instead of `NodeJS.Timeout`.
        let timeoutIds: number[] = [];
        alerts.forEach((alert, index) => {
            const timeoutId = window.setTimeout(() => {
                setDisplayedAlerts(prev => [...prev, alert]);
            }, index * 1000); // Display alerts one by one
            timeoutIds.push(timeoutId);
        });

        return () => {
            timeoutIds.forEach(clearTimeout);
        };
    }, [alerts]);

    const getIcon = (alertText: string) => {
        const lowerText = alertText.toLowerCase();
        if (lowerText.includes('critical') || lowerText.includes('compromise')) {
            return <AlertIcon className="w-5 h-5 text-red-500 flex-shrink-0" />;
        }
        if (lowerText.includes('warning') || lowerText.includes('suspicious')) {
            return <WarningIcon className="w-5 h-5 text-amber-400 flex-shrink-0" />;
        }
        return <TerminalIcon className="w-5 h-5 text-green-400 flex-shrink-0" />;
    };

    return (
        <div className="bg-[#1a1a2e]/60 p-4 rounded-lg border border-purple-500/30 backdrop-blur-sm h-[250px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-3" style={{fontFamily: "'Exo 2', sans-serif"}}>
                Live Event Feed
            </h3>
            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                {displayedAlerts.length === 0 && (
                     <p className="text-sm text-gray-500 animate-pulse">Awaiting system events...</p>
                )}
                {displayedAlerts.map((alert, index) => (
                    <Event key={index} text={alert} icon={getIcon(alert)} />
                ))}
            </div>
        </div>
    );
};

interface EventProps {
    text: string;
    icon: React.ReactNode;
}

const Event: React.FC<EventProps> = ({ text, icon }) => {
    const displayText = useTypewriter(text, 20);
    return (
        <div className="flex items-start gap-3 p-2 bg-black/20 rounded-md animate-fade-in-fast">
            {icon}
            <p className="text-sm text-gray-300 font-mono">{displayText}</p>
        </div>
    );
};

export default LiveEventFeed;