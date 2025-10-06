import { GoogleGenAI, Type } from "@google/genai";
import type { AttackScenario } from "../components/ControlPanel";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mitreCache = new Map<string, string>();

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A concise title for the operation." },
        overview: { type: Type.STRING, description: "A brief summary of the attack scenario." },
        network_graph: {
            type: Type.OBJECT,
            properties: {
                nodes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            label: { type: Type.STRING },
                            type: { type: Type.STRING, description: "e.g., 'attacker', 'user', 'server', 'dc'" },
                            ip: { type: Type.STRING, description: "An IP address for the node." },
                            os: { type: Type.STRING, description: "Operating system, e.g., 'Windows Server 2019'" },
                        },
                        required: ["id", "label", "type", "ip", "os"],
                    },
                },
                edges: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            from: { type: Type.STRING },
                            to: { type: Type.STRING },
                            label: { type: Type.STRING },
                        },
                        required: ["from", "to", "label"],
                    },
                },
            },
            required: ["nodes", "edges"],
        },
        attack_steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    command: {
                        type: Type.OBJECT,
                        properties: {
                            language: { type: Type.STRING },
                            code: { type: Type.STRING },
                        },
                        required: ["language", "code"],
                    },
                    output: { type: Type.STRING, description: "Realistic terminal output from the command execution." },
                    attacker_context: { type: Type.STRING, description: "The attacker's user context after this step, e.g., CORP\\Attacker@CLIENT-01" },
                    newly_compromised_hosts: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "An array of node IDs that are newly compromised in this step."
                    },
                    generated_events: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                severity: { type: Type.STRING, description: "'INFO', 'WARN', or 'ALERT'" },
                                message: { type: Type.STRING, description: "A SIEM-like log message for the event feed." },
                            },
                            required: ["severity", "message"]
                        }
                    },
                    mitre_attack: {
                        type: Type.OBJECT,
                        properties: {
                            tactic: { type: Type.STRING },
                            technique_id: { type: Type.STRING },
                            technique_name: { type: Type.STRING },
                        },
                        required: ["tactic", "technique_id", "technique_name"],
                    },
                },
                required: ["title", "description", "command", "output", "attacker_context", "newly_compromised_hosts", "generated_events", "mitre_attack"],
            },
        },
        defense_recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
    },
    required: [
        "title",
        "overview",
        "network_graph",
        "attack_steps",
        "defense_recommendations",
    ],
};

export interface AttackStep {
    title: string;
    description: string;
    command: { language: string; code: string };
    output: string;
    attacker_context: string;
    newly_compromised_hosts: string[];
    generated_events: { severity: 'INFO' | 'WARN' | 'ALERT'; message: string }[];
    mitre_attack: { tactic: string; technique_id: string; technique_name: string };
}

export interface SimulationData {
    title: string;
    overview: string;
    network_graph: {
        nodes: { id: string; label: string; type: string, ip: string, os: string }[];
        edges: { from: string; to: string; label: string }[];
    };
    attack_steps: AttackStep[];
    defense_recommendations: string[];
}

const generatePrompt = (environment: string, scenario: AttackScenario): string => {
  return `
    Generate a detailed, realistic, and executable Active Directory cyber range operation. This is not a summary; it's a script for a live-fire exercise.

    **AD Environment Description:**
    ${environment}

    **Attack Scenario:**
    ${scenario}

    Based on the provided information, create a comprehensive operation with the following components, conforming strictly to the JSON schema:

    1.  **Title:** A concise, operational title (e.g., "Operation Gilded Lion").
    2.  **Overview:** A mission briefing for the red team operator.
    3.  **Network Graph:** Define all key entities (nodes) with IDs, labels, types ('attacker', 'user', 'server', 'dc'), IP addresses, and OS versions. Define edges to show relationships.
    4.  **Attack Steps:** A granular, step-by-step breakdown of the attack chain. Each step MUST be a single, executable action. For each step:
        *   **title/description:** Describe the immediate objective.
        *   **command:** Provide a SINGLE, realistic command-line snippet an attacker would use.
        *   **output:** Provide the FULL, realistic terminal output the command would produce.
        *   **attacker_context:** State the attacker's security context AFTER this command (e.g., 'CORP\\LowPrivUser@WKSTN-101', 'NT AUTHORITY\\SYSTEM@DC-01').
        *   **newly_compromised_hosts:** List the IDs of any hosts from the network graph that were just compromised in this step.
        *   **generated_events:** List 1-3 SIEM-style log events this action would generate. Classify severity as 'INFO', 'WARN', or 'ALERT'.
        *   **mitre_attack:** Map the step to the relevant MITRE ATT&CK Tactic and Technique.
    5.  **Defense Recommendations:** Actionable defense strategies.

    Return the entire output as a single, valid JSON object. Do not include any markdown formatting or explanations outside of the JSON structure.
    `;
};


export const generateSimulationScenario = async (
  environment: string,
  scenario: AttackScenario
): Promise<SimulationData> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: generatePrompt(environment, scenario),
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema
        }
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data as SimulationData;
  } catch (error) {
    console.error("Error generating simulation scenario:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to parse or generate scenario: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the scenario.");
  }
};

export const getMitreExplanation = async (
    term: string,
    type: 'tactic' | 'technique'
): Promise<string> => {
    const cacheKey = `${type}:${term}`;
    if (mitreCache.has(cacheKey)) {
        return mitreCache.get(cacheKey)!;
    }

    const prompt = `Provide a concise, one-sentence explanation for the MITRE ATT&CK ${type}: "${term}". Focus on the adversary's goal.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 }, 
            }
        });
        
        const explanation = response.text.trim();
        if (explanation) {
            mitreCache.set(cacheKey, explanation);
            return explanation;
        }
        throw new Error("Received an empty explanation from the API.");
    } catch (error) {
        console.error(`Error fetching MITRE explanation for "${term}":`, error);
        if (error instanceof Error) {
            return `Failed to load explanation: ${error.message}`;
        }
        return "Failed to load explanation due to an unknown error.";
    }
};