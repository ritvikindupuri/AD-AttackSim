import React, { useState, useMemo } from 'react';
import { AlertIcon, WarningIcon, TerminalIcon, InfoIcon } from './Icons';
import { SystemAlert } from '../services/aiService';

const SEVERITY_LEVELS = {
    'Critical': { icon: <AlertIcon className="w-5 h-5 text-red-500" />, color: 'bg-red-500/20 border-red-500/40 text-red-300' },
    'High': { icon: <WarningIcon className="w-5 h-5 text-orange-400" />, color: 'bg-orange-500/20 border-orange-500/40 text-orange-300' },
    'Medium': { icon: <WarningIcon className="w-5 h-5 text-amber-400" />, color: 'bg-amber-500/20 border-amber-500/40 text-amber-300' },
    'Low': { icon: <InfoIcon className="w-5 h-5 text-sky-400" />, color: 'bg-sky-500/20 border-sky-500/40 text-sky-300' }
};

// FIX: Add a default style for any unexpected severity values to prevent crashes.
const DEFAULT_SEVERITY_STYLE = { icon: <InfoIcon className="w-5 h-5 text-gray-400" />, color: 'bg-gray-500/20 border-gray-500/40 text-gray-300' };


type Severity = keyof typeof SEVERITY_LEVELS;

interface SIEMDashboardProps {
    alerts: SystemAlert[];
}

const SIEMDashboard: React.FC<SIEMDashboardProps> = ({ alerts }) => {
    const [filter, setFilter] = useState<Severity | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const severityCounts = useMemo(() => {
        return alerts.reduce((acc, alert) => {
            const severityKey = alert.severity as Severity;
            if (SEVERITY_LEVELS[severityKey]) {
                acc[severityKey] = (acc[severityKey] || 0) + 1;
            }
            return acc;
        }, {} as Record<Severity, number>);
    }, [alerts]);

    const filteredAlerts = useMemo(() => {
        return alerts
            .filter(alert => filter === 'All' || alert.severity === filter)
            .filter(alert => alert.description.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => alerts.indexOf(b) - alerts.indexOf(a)); // Show latest first
    }, [alerts, filter, searchQuery]);


    return (
        <div className="bg-[#1a1a2e]/60 p-4 rounded-lg border border-purple-500/30 backdrop-blur-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-3" style={{fontFamily: "'Exo 2', sans-serif"}}>
                SIEM Dashboard
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                {(Object.keys(SEVERITY_LEVELS) as Severity[]).map(level => (
                    <button 
                        key={level}
                        onClick={() => setFilter(current => current === level ? 'All' : level)}
                        className={`p-2 rounded text-left transition-colors ${filter === level ? 'bg-green-500/30' : 'bg-black/20 hover:bg-white/10'}`}
                    >
                        <p className="font-bold text-sm text-gray-300">{level}</p>
                        <p className="text-2xl font-bold text-white">{severityCounts[level] || 0}</p>
                    </button>
                ))}
            </div>

            <div className="mb-3">
                <input 
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900/70 border border-purple-500/30 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all placeholder-gray-500 text-sm"
                />
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                {filteredAlerts.length === 0 ? (
                     <p className="text-sm text-center text-gray-500 pt-4">No matching events.</p>
                ) : (
                    filteredAlerts.map((alert, index) => {
                        const severityStyle = SEVERITY_LEVELS[alert.severity as Severity] || DEFAULT_SEVERITY_STYLE;
                        return (
                            <div key={index} className={`flex items-start gap-3 p-2 rounded-md animate-fade-in-fast border ${severityStyle.color}`}>
                                {severityStyle.icon}
                                <div className="flex-grow">
                                    <p className="text-xs text-gray-400 font-mono">{alert.timestamp}</p>
                                    <p className="text-sm font-mono">{alert.description}</p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};

export default SIEMDashboard;