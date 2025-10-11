import { GoogleGenAI, Type } from "@google/genai";

// --- TypeScript Interfaces for Simulation Data ---

export interface Command {
  command: string;
  language: 'powershell' | 'bash' | 'cmd';
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'Domain Controller' | 'Member Server' | 'Workstation' | 'Firewall' | 'Internet';
  os: string;
}

export interface NetworkEdge {
  from: string;
  to: string;
}

export interface NetworkTopology {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface MitreTechnique {
    id: string; // e.g., "T1059.001"
    name: string; // e.g., "PowerShell"
    description: string[]; // 3-5 bullet points
}

export interface PowerShellLog {
    event_id: 4104; // Focused on Script Block Logging
    user: string;
    hostname: string;
    script_block_text: string;
}

export interface AttackStep {
  step: number;
  title: string;
  description: string;
  target_host_id: string;
  commands: Command[];
  mitre_tactics: string[];
  mitre_techniques: MitreTechnique[];
  system_alerts: string[];
  defense_recommendations: string[];
  compromised_host_ids: string[];
  security_posture: 'Secure' | 'Guarded' | 'Critical';
  powershell_logs?: PowerShellLog[]; // Added for enhanced logging
}

export interface SimulationScenario {
  title: string;
  description: string; // Markdown supported
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
    timestamp?: string; // ISO string, optional for backward compatibility
}

// --- Provider-Specific Schemas and Logic ---

// --- Google Gemini ---

const getGeminiClient = () => {
  const apiKey = JSON.parse(localStorage.getItem('adversary_gemini_api_key') || '""');
  if (!apiKey) {
    throw new Error("Google Gemini API key not found. Please set it in the application's settings.");
  }
  return new GoogleGenAI({ apiKey });
};

const geminiCommandSchema = {
    type: Type.OBJECT, properties: {
        command: { type: Type.STRING, description: "The exact command executed." },
        language: { type: Type.STRING, description: "Shell language: 'powershell', 'cmd', 'bash'." },
    }, required: ["command", "language"],
};
const geminiMitreTechniqueSchema = {
    type: Type.OBJECT, properties: {
        id: { type: Type.STRING, description: "The official technique ID, e.g., 'T1059.001'." },
        name: { type: Type.STRING, description: "The full name of the technique, e.g., 'PowerShell'." },
        description: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 bullet points briefly explaining the technique." },
    }, required: ["id", "name", "description"],
};
const geminiPowerShellLogSchema = {
    type: Type.OBJECT, properties: {
        event_id: { type: Type.INTEGER, description: "Must be 4104 for Script Block Logging." },
        user: { type: Type.STRING, description: "The user context under which the command was run, e.g., 'ADVERSARY\\Administrator'." },
        hostname: { type: Type.STRING, description: "The hostname where the log was generated, corresponding to the target_host_id." },
        script_block_text: { type: Type.STRING, description: "The full, unobfuscated text of the executed PowerShell script block. This should match the command." },
    }, required: ["event_id", "user", "hostname", "script_block_text"],
};
const geminiNodeSchema = {
    type: Type.OBJECT, properties: {
        id: { type: Type.STRING, description: "Short, unique ID, e.g., 'DC01'." },
        label: { type: Type.STRING, description: "Descriptive label, e.g., 'Primary Domain Controller'." },
        type: { type: Type.STRING, description: "Role: 'Domain Controller', 'Member Server', 'Workstation', 'Firewall', 'Internet'." },
        os: { type: Type.STRING, description: "Operating system, e.g., 'Windows Server 2022'." },
    }, required: ["id", "label", "type", "os"],
};
const geminiEdgeSchema = {
    type: Type.OBJECT, properties: {
        from: { type: Type.STRING, description: "Source node ID." },
        to: { type: Type.STRING, description: "Target node ID." },
    }, required: ["from", "to"],
};
const geminiAttackStepSchema = {
    type: Type.OBJECT, properties: {
        step: { type: Type.INTEGER, description: "Sequential step number, starting from 1." },
        title: { type: Type.STRING, description: "Concise title for the attack step." },
        description: { type: Type.STRING, description: "Clear, high-level description of the attacker's action." },
        target_host_id: { type: Type.STRING, description: "Primary host ID targeted in this step." },
        commands: { type: Type.ARRAY, items: geminiCommandSchema },
        mitre_tactics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant MITRE ATT&CK Tactic names." },
        mitre_techniques: { type: Type.ARRAY, items: geminiMitreTechniqueSchema },
        system_alerts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Realistic SIEM alerts generated by this activity." },
        defense_recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable recommendations for defenders." },
        compromised_host_ids: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cumulative list of all compromised host IDs up to this step." },
        security_posture: { type: Type.STRING, description: "Overall security posture after this step: 'Secure', 'Guarded', or 'Critical'." },
        powershell_logs: { type: Type.ARRAY, items: geminiPowerShellLogSchema, description: "Optional. Detailed PowerShell logs (Event ID 4104) generated by the commands in this step. Generate this for every PowerShell command executed." },
    }, required: ["step", "title", "description", "target_host_id", "commands", "mitre_tactics", "mitre_techniques", "system_alerts", "defense_recommendations", "compromised_host_ids", "security_posture"],
};
const geminiScenarioSchema = {
    type: Type.OBJECT, properties: {
        title: { type: Type.STRING, description: "Engaging title for the simulation." },
        description: { type: Type.STRING, description: "Executive summary in Markdown format." },
        network_topology: { type: Type.OBJECT, properties: {
                nodes: { type: Type.ARRAY, items: geminiNodeSchema },
                edges: { type: Type.ARRAY, items: geminiEdgeSchema },
            }, required: ["nodes", "edges"],
        },
        steps: { type: Type.ARRAY, items: geminiAttackStepSchema, description: "Chronological breakdown of the attack." },
    }, required: ["title", "description", "network_topology", "steps"],
};

// --- OpenAI ---

const openAICommandSchema = {
    type: "object", properties: {
        command: { type: "string", description: "The exact command executed." },
        language: { type: "string", enum: ["powershell", "cmd", "bash"], description: "Shell language." },
    }, required: ["command", "language"],
};
const openAIMitreTechniqueSchema = {
    type: "object", properties: {
        id: { type: "string", description: "The official technique ID, e.g., 'T1059.001'." },
        name: { type: "string", description: "The full name of the technique, e.g., 'PowerShell'." },
        description: { type: "array", items: { type: "string" }, description: "A list of 3-5 bullet points briefly explaining the technique." },
    }, required: ["id", "name", "description"],
};
const openAIPowerShellLogSchema = {
    type: "object", properties: {
        event_id: { type: "integer", enum: [4104], description: "PowerShell Event ID 4104 for Script Block Logging." },
        user: { type: "string", description: "User context, e.g., 'ADVERSARY\\Administrator'." },
        hostname: { type: "string", description: "Hostname of log source, e.g., 'DC01'." },
        script_block_text: { type: "string", description: "The full, unobfuscated script block text. This should match the command." },
    }, required: ["event_id", "user", "hostname", "script_block_text"],
};
const openAINodeSchema = {
    type: "object", properties: {
        id: { type: "string", description: "Short, unique ID, e.g., 'DC01'." },
        label: { type: "string", description: "Descriptive label, e.g., 'Primary Domain Controller'." },
        type: { type: "string", enum: ['Domain Controller', 'Member Server', 'Workstation', 'Firewall', 'Internet'], description: "Role of the host." },
        os: { type: "string", description: "Operating system, e.g., 'Windows Server 2022'." },
    }, required: ["id", "label", "type", "os"],
};
const openAIEdgeSchema = {
    type: "object", properties: { from: { type: "string" }, to: { type: "string" } }, required: ["from", "to"],
};
const openAIAttackStepSchema = {
    type: "object", properties: {
        step: { type: "integer" }, title: { type: "string" }, description: { type: "string" },
        target_host_id: { type: "string" }, commands: { type: "array", items: openAICommandSchema },
        mitre_tactics: { type: "array", items: { type: "string" } },
        mitre_techniques: { type: "array", items: openAIMitreTechniqueSchema },
        system_alerts: { type: "array", items: { type: "string" } },
        defense_recommendations: { type: "array", items: { type: "string" } },
        compromised_host_ids: { type: "array", items: { type: "string" } },
        security_posture: { type: "string", enum: ['Secure', 'Guarded', 'Critical'] },
        powershell_logs: { type: "array", items: openAIPowerShellLogSchema, description: "Optional. Detailed PowerShell logs generated by this step's commands." },
    }, required: ["step", "title", "description", "target_host_id", "commands", "mitre_tactics", "mitre_techniques", "system_alerts", "defense_recommendations", "compromised_host_ids", "security_posture"],
};
const openAIScenarioSchema = {
    type: "object", properties: {
        title: { type: "string" }, description: { type: "string" },
        network_topology: { type: "object", properties: {
                nodes: { type: "array", items: openAINodeSchema },
                edges: { type: "array", items: openAIEdgeSchema },
            }, required: ["nodes", "edges"],
        },
        steps: { type: "array", items: openAIAttackStepSchema },
    }, required: ["title", "description", "network_topology", "steps"],
};

// --- Main Service Functions (Routers) ---

const getSystemPrompt = () => `You are an expert cybersecurity red team operator and AI simulation engine named "ADversary". Your task is to generate a realistic, step-by-step Active Directory attack simulation based on user-defined parameters.
**Instructions:**
1.  **Analyze the Environment:** Carefully parse the provided YAML configuration to understand the network topology, hosts, and services. This is your source of truth.
2.  **Design Attack Path:** Create a logical and credible attack chain based on the primary attack vector.
3.  **Incorporate Directives:** Adhere to any special instructions.
4.  **Generate Narrative:** Create a compelling scenario with a clear attacker objective. The simulation must be educational, demonstrating real-world tactics.
5.  **Be Realistic:** All commands, tool outputs, and system alerts must be technically accurate. For MITRE techniques, provide the ID, name, and a 3-5 bullet point description.
6.  **Populate All Fields:** You MUST fully populate every field in the provided JSON schema. Do not leave any fields empty. The 'compromised_host_ids' array must be cumulative with each step.
7.  **Generate Realistic PowerShell Logs:** For each step involving PowerShell commands, you MUST generate a corresponding detailed log entry for Event ID 4104 (Script Block Logging). The 'script_block_text' field for this log must contain the full, unobfuscated command or script that was executed. These logs are crucial for the simulation's defensive analysis.`;

const getUserPrompt = (environment: string, attackType: string, attackDirectives: string) => `
    **Primary Attack Vector:** "${attackType}"
    **Attack Directives:** "${attackDirectives || 'None'}"

    **User-Defined Environment (YAML):**
    \`\`\`yaml
    ${environment}
    \`\`\`
    Now, generate the complete simulation scenario in the required JSON format.
`;

export const generateSimulationScenario = async (
  environment: string, 
  attackType: string, 
  attackDirectives: string
): Promise<SimulationScenario> => {
    const provider = JSON.parse(localStorage.getItem('adversary_ai_provider') || '"gemini"');
    const userPrompt = getUserPrompt(environment, attackType, attackDirectives);

    if (provider === 'openai') {
        return generateWithOpenAI(userPrompt);
    }
    // Default to Gemini
    return generateWithGemini(userPrompt);
};

// --- Provider-Specific Implementations ---

async function generateWithGemini(prompt: string): Promise<SimulationScenario> {
    try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${getSystemPrompt()}\n${prompt}`,
            config: { responseMimeType: "application/json", responseSchema: geminiScenarioSchema },
        });
        return JSON.parse(response.text.trim()) as SimulationScenario;
    } catch (error: any) {
        console.error("Error with Gemini service:", error);
        const message = error.message.includes("API key not found") 
            ? error.message
            : "Failed to generate simulation via Gemini. Check your environment configuration and ensure your API key is correct.";
        throw new Error(message);
    }
}

async function generateWithOpenAI(prompt: string): Promise<SimulationScenario> {
    const apiKey = JSON.parse(localStorage.getItem('adversary_openai_api_key') || '""');
    if (!apiKey) {
        throw new Error("OpenAI API key not found. Please set it in the application's settings.");
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: getSystemPrompt() },
                    { role: 'user', content: prompt }
                ],
                tools: [{ type: "function", function: { name: "generate_simulation", parameters: openAIScenarioSchema } }],
                tool_choice: { type: "function", function: { name: "generate_simulation" } },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const toolCall = data.choices[0]?.message?.tool_calls?.[0];
        if (!toolCall || toolCall.type !== 'function') {
            throw new Error("OpenAI response did not contain the expected function call.");
        }
        
        return JSON.parse(toolCall.function.arguments) as SimulationScenario;
    } catch (error: any) {
        console.error("Error with OpenAI service:", error);
        const message = error.message.includes("API key not found")
            ? error.message
            : `Failed to generate simulation via OpenAI. ${error.message}`;
        throw new Error(message);
    }
}