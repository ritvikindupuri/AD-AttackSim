import React from 'react';
import { AttackStep } from '../services/aiService';
import TabbedPanel from './TabbedPanel';
import CodeBlock from './CodeBlock';
import DefensePanel from './DefensePanel';
import Tooltip from './Tooltip';
import { MitreIcon } from './Icons';
import MitreExplanation from './MitreExplanation';

interface ThreatIntelPanelProps {
    step: AttackStep;
}

const MitreTooltipContent: React.FC<{ id: string, name: string, type: 'tactic' | 'technique'}> = ({ id, name, type }) => (
    <div className="text-left p-1">
        <p className="font-bold text-base text-white">{id}: {name}</p>
        <p className="text-xs text-gray-400 mb-2 font-semibold">Framework: MITRE ATT&CK®</p>
        <div className="border-t border-green-500/20 pt-2 mt-2">
            <MitreExplanation term={name} type={type} />
        </div>
    </div>
);


const ThreatIntelPanel: React.FC<ThreatIntelPanelProps> = ({ step }) => {
    return (
        <div className="bg-black/40 rounded-lg border border-green-500/20 backdrop-blur-sm">
            <div className="p-4 border-b border-green-500/20">
                <h3 className="text-xl font-bold text-white" style={{fontFamily: "'Exo 2', sans-serif"}}>{step.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs">
                    <Tooltip content={<MitreTooltipContent id={step.mitre_tactic.id} name={step.mitre_tactic.name} type="tactic" />}>
                        <div className="flex items-center gap-2 font-semibold text-cyan-300 bg-cyan-900/40 px-2 py-1 rounded cursor-pointer">
                            <MitreIcon className="w-4 h-4" />
                            <span>{step.mitre_tactic.id}: {step.mitre_tactic.name}</span>
                        </div>
                    </Tooltip>
                     <Tooltip content={<MitreTooltipContent id={step.mitre_technique.id} name={step.mitre_technique.name} type="technique" />}>
                        <div className="flex items-center gap-2 font-semibold text-purple-300 bg-purple-900/40 px-2 py-1 rounded cursor-pointer">
                           <MitreIcon className="w-4 h-4" />
                           <span>{step.mitre_technique.id}: {step.mitre_technique.name}</span>
                        </div>
                    </Tooltip>
                </div>
            </div>
            
            <TabbedPanel>
                {{
                    'Adversary Commands': (
                        <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                            {step.adversary_commands.map((cmd, index) => (
                                <div key={index}>
                                    <p className="text-sm text-gray-300 mb-1">{cmd.description}</p>
                                    <CodeBlock code={cmd.command} language="powershell" />
                                </div>
                            ))}
                        </div>
                    ),
                    'Defense Recommendations': <DefensePanel recommendations={step.defense_recommendations} />,
                }}
            </TabbedPanel>
        </div>
    )
}

export default ThreatIntelPanel;