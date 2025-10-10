import { GoogleGenAI, Type } from "@google/genai";

// FIX: Initialize the GoogleGenAI client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Data structures for the simulation
export interface Node {
    id: string;
    hostname: string;
    ip_address: string;
    type: 'Domain Controller' | 'File Server' | 'Workstation' | 'Web Server' | 'Database Server';
}

export interface Edge {
    source: string; // node id
    target: string; // node id
}

export interface NetworkTopology {
    nodes: Node[];
    edges: Edge[];
}

export interface MitreInfo {
    id: string;
    name: string;
}

export interface AdversaryCommand {
    description: string;
    command: string;
}

export interface SystemAlert {
    timestamp: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    description: string;
}

export interface AttackStep {
    title: string;
    description: string;
    target_host_id: string;
    compromised_host_ids: string[];
    security_posture: 'Secure' | 'Guarded' | 'Critical';
    system_alerts: SystemAlert[];
    mitre_tactic: MitreInfo;
    mitre_technique: MitreInfo;
    adversary_commands: AdversaryCommand[];
    defense_recommendations: string[];
}

export interface SimulationScenario {
    title: string;
    description: string;
    network_topology: NetworkTopology;
    steps: AttackStep[];
}


export interface ScenarioUserInput {
    environment: string;
    attackType: string;
    attackDirectives: string;
}

export interface ExportedScenario {
    userInput: ScenarioUserInput;
    scenarioData: SimulationScenario;
}


// Define the response schema for the AI model
const scenarioSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        network_topology: {
            type: Type.OBJECT,
            properties: {
                nodes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            hostname: { type: Type.STRING },
                            ip_address: { type: Type.STRING },
                            type: { type: Type.STRING },
                        },
                        required: ['id', 'hostname', 'ip_address', 'type']
                    }
                },
                edges: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            source: { type: Type.STRING },
                            target: { type: Type.STRING },
                        },
                        required: ['source', 'target']
                    }
                },
            },
            required: ['nodes', 'edges']
        },
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    target_host_id: { type: Type.STRING },
                    compromised_host_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
                    security_posture: { type: Type.STRING },
                    system_alerts: { 
                        type: Type.ARRAY, 
                        items: { 
                            type: Type.OBJECT,
                            properties: {
                                timestamp: { type: Type.STRING },
                                severity: { type: Type.STRING },
                                description: { type: Type.STRING },
                            },
                            required: ['timestamp', 'severity', 'description']
                        }
                    },
                    mitre_tactic: {
                        type: Type.OBJECT,
                        properties: { id: { type: Type.STRING }, name: { type: Type.STRING } },
                        required: ['id', 'name']
                    },
                    mitre_technique: {
                        type: Type.OBJECT,
                        properties: { id: { type: Type.STRING }, name: { type: Type.STRING } },
                        required: ['id', 'name']
                    },
                    adversary_commands: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                description: { type: Type.STRING },
                                command: { type: Type.STRING },
                            },
                            required: ['description', 'command']
                        }
                    },
                    defense_recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'description', 'target_host_id', 'compromised_host_ids', 'security_posture', 'system_alerts', 'mitre_tactic', 'mitre_technique', 'adversary_commands', 'defense_recommendations']
            }
        },
    },
    required: ['title', 'description', 'network_topology', 'steps']
};


export const generateSimulationScenario = async (
    environmentDescription: string,
    attackType: string,
    attackDirectives: string
): Promise<SimulationScenario> => {
    const directivesSection = attackDirectives.trim() 
        ? `
    **Attack Directives:**
    The user has provided the following specific directives. These are high-priority constraints or goals that MUST be incorporated to refine the primary attack vector.
    \`\`\`
    ${attackDirectives}
    \`\`\`
    `
        : '';

    const prompt = `
    Generate a realistic Active Directory attack simulation for "ADversary". The user's environment is provided in a structured YAML-like format. This configuration is the absolute and only source of truth for the environment's state.
    You MUST parse this configuration and generate a scenario based *exclusively* on the provided details.
    Do NOT invent or hallucinate any assets, configurations, or vulnerabilities not explicitly mentioned or logically implied by the user's input.

    - Primary Attack Vector: "${attackType}"
    - User Environment Configuration:
    \`\`\`yaml
    ${environmentDescription}
    \`\`\`
    ${directivesSection}
    The output must be a single, valid JSON object that strictly adheres to the provided schema.

    **Core Directives:**
    1.  **Strict Grounding:** Base the entire scenario ONLY on the user's YAML configuration. The network topology you generate must be a direct reflection of the assets defined by the user.
    2.  **Network Topology:**
        -   Use the hostnames, OS versions, and roles provided.
        -   If IPs are provided, use them. If not, infer a realistic private IPv4 subnet (e.g., 10.0.0.0/24) that matches the scale of the environment and assign valid IPs to all nodes.
        -   Ensure all IDs ('id', 'source', 'target', 'target_host_id') are consistent and valid within your generated topology.
    3.  **Attack Steps (5-8 steps):**
        -   Create a logical attack chain that is plausible within the user's defined security posture. For example, if an EDR is mentioned, the attacker's TTPs should attempt to evade or disable it.
        -   'compromised_host_ids' must be cumulative.
        -   **System Alerts:** Generate 2-4 structured SIEM alerts per step, reflecting the described security tools. Each alert must have a relative 'timestamp' ("T+0m 3s"), a 'severity', and a professional 'description'.
    4.  **Realism:** All commands, descriptions, and recommendations must be professional and technically accurate.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: scenarioSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SimulationScenario;

    } catch (error) {
        console.error("Error generating simulation scenario:", error);
        throw new Error("Failed to generate simulation scenario from AI service. Please check the API key and network connection.");
    }
};

export const getMitreExplanation = async (term: string, type: 'tactic' | 'technique'): Promise<string> => {
    const prompt = `
    Provide a professional, 3-5 sentence summary of the MITRE ATT&CK ${type}: "${term}". 
    The summary should be suitable for a tooltip in a cybersecurity application, providing clear context for a security analyst.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error getting MITRE explanation:", error);
        throw new Error("Failed to get MITRE explanation.");
    }
};
