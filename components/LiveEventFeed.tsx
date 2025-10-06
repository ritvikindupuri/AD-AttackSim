import React, { useRef, useEffect } from 'react';
import { AttackStep } from '../services/geminiService';
import { InfoIcon, TerminalIcon, WarningIcon } from './Icons';

type Event = AttackStep['generated_events'][0];

const SeverityIcon: React.FC<{severity: Event['severity']}> = ({ severity }) => {
    switch (severity) {
        case 'ALERT':
            return <WarningIcon className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />;
        case 'WARN':
            return <InfoIcon className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />;
        case 'INFO':
        default:
            return <TerminalIcon className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />;
    }
}

const getSeverityColor = (severity: Event['severity']) => {
    switch(severity) {
        case 'ALERT': return 'text-red-300/90';
        case 'WARN': return 'text-yellow-300/90';
        case 'INFO': default: return 'text-cyan-300/90';
    }
}

const LiveEventFeed: React.FC<{ events: Event[] }> = ({ events }) => {
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [events]);

  return (
    <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50 h-[300px] flex flex-col">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2" style={{fontFamily: "'Teko', sans-serif"}}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Live Event Feed
        </h3>
        <div ref={feedRef} className="overflow-y-auto flex-grow pr-2 font-mono text-xs">
            {events.length === 0 && <p className="text-gray-500">Awaiting operational events...</p>}
            {events.map((event, index) => (
                <div key={index} className="flex items-start gap-2 mb-2 animate-fade-in">
                    <SeverityIcon severity={event.severity} />
                    <p className={`flex-grow ${getSeverityColor(event.severity)}`}>
                        {event.message}
                    </p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default LiveEventFeed;
