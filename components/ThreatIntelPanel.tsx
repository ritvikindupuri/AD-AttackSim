import React from 'react';
import { AttackStep } from '../services/aiService';
import { ShieldIcon, TerminalIcon } from './Icons';
import CodeBlock from './CodeBlock';
import TabbedPanel from './TabbedPanel';
import DefensePanel from './DefensePanel';
import PowerShellLogViewer from './PowerShellLogViewer';

interface ThreatIntelPanelProps {
  step: AttackStep;
}

const MitreAttackPanel: React.FC<{ step: AttackStep }> = ({ step }) => {
    // Helper to generate the correct MITRE ATT&CK link
    const getMitreLink = (techniqueId: string) => {
        const baseUrl = 'https://attack.mitre.org/techniques/';
        const formattedId = techniqueId.replace('.', '/');
        return `${baseUrl}${formattedId}`;
    };

    return (
        <div className="p-2 space-y-4 text-sm text-gray-300 h-[264px] overflow-y-auto pr-2">
            {step.mitre_tactics.map((tactic, index) => (
                 <div key={index}>
                    <h4 className="font-bold text-gray-200 mb-2 uppercase text-xs tracking-wider">Tactic: <span className="text-purple-300">{tactic}</span></h4>
                    <div className="pl-4 border-l-2 border-purple-500/20 space-y-3">
                        {step.mitre_techniques.map(tech => (
                            <div key={tech.id}>
                                <a 
                                    href={getMitreLink(tech.id)} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="font-bold text-sky-300 hover:text-sky-200 hover:underline transition-colors"
                                >
                                    {tech.id}: {tech.name}
                                </a>
                                <ul className="list-disc list-inside pl-2 mt-1 text-gray-400 text-xs space-y-1">
                                    {tech.description.map((desc, i) => (
                                        <li key={i}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};


const ThreatIntelPanel: React.FC<ThreatIntelPanelProps> = ({ step }) => {
    const tabs: { [key: string]: React.ReactNode } = {
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
             <MitreAttackPanel step={step} />
        ),
    };

    // Dynamically add the PowerShell logs tab if data exists
    if (step.powershell_logs && step.powershell_logs.length > 0) {
        tabs["PowerShell Events"] = <PowerShellLogViewer logs={step.powershell_logs} />;
    }

    tabs["Defense"] = <DefensePanel recommendations={step.defense_recommendations} />;

    return (
        <div className="bg-black/40 p-4 rounded-lg border border-green-500/20 backdrop-blur-sm">
            <div className="px-2">
                 <h3 className="text-xl font-bold text-white mb-1" style={{fontFamily: "'Exo 2', sans-serif"}}>{step.title}</h3>
                 <p className="text-sm text-gray-400 mb-4">{step.description}</p>
            </div>
            <TabbedPanel>
                {tabs}
            </TabbedPanel>
        </div>
    );
};

export default ThreatIntelPanel;
