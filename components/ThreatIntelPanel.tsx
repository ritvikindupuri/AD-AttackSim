import React from 'react';
import { AttackStep } from '../services/aiService';
import { MitreIcon, ShieldIcon, TerminalIcon } from './Icons';
import CodeBlock from './CodeBlock';
import TabbedPanel from './TabbedPanel';
import MitreExplanation from './MitreExplanation';
import DefensePanel from './DefensePanel';
import Tooltip from './Tooltip';

interface ThreatIntelPanelProps {
  step: AttackStep;
}

const ThreatIntelPanel: React.FC<ThreatIntelPanelProps> = ({ step }) => {
  return (
    <div className="bg-black/40 p-4 rounded-lg border border-green-500/20 backdrop-blur-sm">
        <div className="px-2">
             <h3 className="text-xl font-bold text-white mb-1" style={{fontFamily: "'Exo 2', sans-serif"}}>{step.title}</h3>
             <p className="text-sm text-gray-400 mb-4">{step.description}</p>
        </div>
        <TabbedPanel>
            {{
                "Attacker Shell": (
                    <div className="p-2 h-[264px] overflow-y-auto">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                           <TerminalIcon className="w-5 h-5 text-green-400"/> 
                           <span>Executed Commands on <span className="text-green-300">{step.target_host_id}</span></span>
                        </h4>
                        {step.commands.map((cmd, index) => (
                            <CodeBlock key={index} code={cmd.command} language={cmd.language} />
                        ))}
                    </div>
                ),
                "MITRE ATT&CK": (
                     <div className="p-2 space-y-4 text-sm text-gray-300 h-[264px] overflow-y-auto pr-2">
                        <div>
                            <h4 className="font-bold text-gray-200 mb-2">Tactics</h4>
                            <div className="flex flex-wrap gap-2">
                                {step.mitre_tactics.map(tactic => (
                                    <Tooltip key={tactic} content={<MitreExplanation term={tactic} type="tactic" />}>
                                        <span className="bg-purple-800/50 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-500/50 cursor-pointer">{tactic}</span>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h4 className="font-bold text-gray-200 mb-2">Techniques</h4>
                            <div className="flex flex-wrap gap-2">
                                {step.mitre_techniques.map(tech => (
                                     <Tooltip key={tech} content={<MitreExplanation term={tech} type="technique" />}>
                                        <span className="bg-sky-800/50 text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-sky-500/50 cursor-pointer">{tech}</span>
                                     </Tooltip>
                                ))}
                            </div>
                        </div>
                    </div>
                ),
                "Defense": (
                    <DefensePanel recommendations={step.defense_recommendations} />
                )
            }}
        </TabbedPanel>
    </div>
  );
};

export default ThreatIntelPanel;
