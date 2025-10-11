import { GoogleGenAI, Type } from "@google/genai";

// AI Client Initialization is now dynamic to use user-provided key.
const getAiClient = () => {
  // Safely parse the key from localStorage. It's stored as a JSON string.
  const apiKey = JSON.parse(localStorage.getItem('adversary_api_key') || '""');
  if (!apiKey) {
    throw new Error("Gemini API key not found. Please set it in the application's settings.");
  }
  return new GoogleGenAI({ apiKey });
};


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

export interface AttackStep {
  step: number;
  title: string;
  description: string;
  target_host_id: string;
  commands: Command[];
  mitre_tactics: string[];
  mitre_techniques: string[];
  system_alerts: string[];
  defense_recommendations: string[];
  compromised_host_ids: string[];
  security_posture: 'Secure' | 'Guarded' | 'Critical';
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
}


// --- Gemini API Schema Definition ---

const commandSchema = {
    type: Type.OBJECT,
    properties: {
        command: { type: Type.STRING, description: "The exact command executed by the attacker." },
        language: { type: Type.STRING, description: "The shell language of the command, e.g., 'powershell', 'cmd', 'bash'." },
    },
    required: ["command", "language"],
};

const nodeSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A short, unique identifier for the host, e.g., 'DC01', 'FIN-WS01'." },
        label: { type: Type.STRING, description: "A descriptive label for the node, e.g., 'Primary Domain Controller'." },
        type: { type: Type.STRING, description: "The role of the host: 'Domain Controller', 'Member Server', 'Workstation', 'Firewall', 'Internet'." },
        os: { type: Type.STRING, description: "The operating system of the host, e.g., 'Windows Server 2022'." },
    },
    required: ["id", "label", "type", "os"],
};

const edgeSchema = {
    type: Type.OBJECT,
    properties: {
        from: { type: Type.STRING, description: "The ID of the source node for the connection." },
        to: { type: Type.STRING, description: "The ID of the target node for the connection." },
    },
    required: ["from", "to"],
};

const attackStepSchema = {
    type: Type.OBJECT,
    properties: {
        step: { type: Type.INTEGER, description: "The sequential number of this attack step, starting from 1." },
        title: { type: Type.STRING, description: "A concise title for the attack step, e.g., 'Initial Compromise via Phishing'." },
        description: { type: Type.STRING, description: "A clear, high-level description of what the attacker is doing in this step." },
        target_host_id: { type: Type.STRING, description: "The ID of the primary host being targeted in this step." },
        commands: { type: Type.ARRAY, items: commandSchema, description: "An array of commands executed in this step." },
        mitre_tactics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of relevant MITRE ATT&CK Tactic names, e.g., 'Execution'." },
        mitre_techniques: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of relevant MITRE ATT&CK Technique names, e.g., 'PowerShell'." },
        system_alerts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of SIEM alerts or system events that this activity would realistically generate." },
        defense_recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable recommendations for defenders to detect or prevent this step." },
        compromised_host_ids: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A cumulative list of all host IDs that have been compromised up to and including this step." },
        security_posture: { type: Type.STRING, description: "The overall security posture of the environment after this step: 'Secure', 'Guarded', or 'Critical'." },
    },
    required: ["step", "title", "description", "target_host_id", "commands", "mitre_tactics", "mitre_techniques", "system_alerts", "defense_recommendations", "compromised_host_ids", "security_posture"],
};

const scenarioSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "An engaging and descriptive title for the entire simulation scenario." },
        description: { type: Type.STRING, description: "An executive summary of the scenario in Markdown format. Describe the attacker's goal, the target environment, and the overall narrative." },
        network_topology: {
            type: Type.OBJECT,
            properties: {
                nodes: { type: Type.ARRAY, items: nodeSchema, description: "All nodes (computers, servers) present in the environment." },
                edges: { type: Type.ARRAY, items: edgeSchema, description: "The network connections between the nodes." },
            },
            required: ["nodes", "edges"],
        },
        steps: {
            type: Type.ARRAY,
            items: attackStepSchema,
            description: "A chronological, step-by-step breakdown of the attack sequence."
        },
    },
    required: ["title", "description", "network_topology", "steps"],
};


// --- Service Functions ---

export const generateSimulationScenario = async (
  environment: string, 
  attackType: string, 
  attackDirectives: string
): Promise<SimulationScenario> => {
  const prompt = `
    You are an expert cybersecurity red team operator and AI simulation engine named "ADversary". Your task is to generate a realistic, step-by-step Active Directory attack simulation based on user-defined parameters.

    **Instructions:**
    1.  **Analyze the Environment:** Carefully parse the provided YAML configuration to understand the network topology, hosts, and services. This is your source of truth.
    2.  **Select Attack Path:** Design a logical and credible attack chain based on the primary attack vector: "${attackType}".
    3.  **Incorporate Directives:** Adhere to any special instructions: "${attackDirectives || 'None'}".
    4.  **Generate Narrative:** Create a compelling scenario with a clear attacker objective. The simulation must be educational, demonstrating real-world tactics.
    5.  **Be Realistic:** All commands, tool outputs, and system alerts must be technically accurate for the specified OS and services.
    6.  **Populate All Fields:** You MUST fully populate every field in the provided JSON schema. Do not leave any fields empty. The 'compromised_host_ids' array must be cumulative with each step.

    **User-Defined Environment (YAML):**
    \`\`\`yaml
    ${environment}
    \`\`\`

    Now, generate the complete simulation scenario in the required JSON format.
  `;

  try {
    const ai = getAiClient();
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
  } catch (error: any) {
    console.error("Error generating simulation scenario:", error);
    // Provide a more user-friendly error message
    const message = error.message.includes("API key not found") 
        ? error.message
        : "Failed to generate the simulation scenario from the AI service. Please check your environment configuration and ensure your API key is correct and valid.";
    throw new Error(message);
  }
};


export const getMitreExplanation = async (
  term: string, 
  type: 'tactic' | 'technique'
): Promise<string> => {
  const prompt = `
    Provide a concise, one-sentence explanation for the following MITRE ATT&CK ${type}: "${term}". 
    Focus on the high-level goal or action it represents.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error(`Error getting MITRE explanation for ${term}:`, error);
    return `Could not load explanation for ${term}.`;
  }
};