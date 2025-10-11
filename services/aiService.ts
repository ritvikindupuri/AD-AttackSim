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
  defensive_choices: string[]; // NEW: Options for the user's next move
  compromised_host_ids: string[];
  security_posture: 'Secure' | 'Guarded' | 'Critical';
  powershell_logs?: PowerShellLog[]; 
}

// Used for the full simulation object when exporting/storing in history
export interface SimulationScenario {
  title: string;
  description: string; // Markdown supported
  network_topology: NetworkTopology;
  steps: AttackStep[];
}

// Used for the initial AI generation
export interface InitialSimulation {
    title: string;
    description: string;
    network_topology: NetworkTopology;
    first_step: AttackStep;
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

// --- Google Gemini Configuration ---

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Google Gemini API key not found. Please ensure it is configured in the environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// --- Schemas for AI Response Validation ---

const commandSchema = {
    type: Type.OBJECT, properties: {
        command: { type: Type.STRING, description: "The exact command executed." },
        language: { type: Type.STRING, description: "Shell language: 'powershell', 'cmd', 'bash'." },
    }, required: ["command", "language"],
};
const mitreTechniqueSchema = {
    type: Type.OBJECT, properties: {
        id: { type: Type.STRING, description: "The official technique ID, e.g., 'T1059.001'." },
        name: { type: Type.STRING, description: "The full name of the technique, e.g., 'PowerShell'." },
        description: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 bullet points briefly explaining the technique." },
    }, required: ["id", "name", "description"],
};
const powerShellLogSchema = {
    type: Type.OBJECT, properties: {
        event_id: { type: Type.INTEGER, description: "Must be 4104 for Script Block Logging." },
        user: { type: Type.STRING, description: "The user context under which the command was run, e.g., 'ADVERSARY\\Administrator'." },
        hostname: { type: Type.STRING, description: "The hostname where the log was generated, corresponding to the target_host_id." },
        script_block_text: { type: Type.STRING, description: "The full, unobfuscated text of the executed PowerShell script block. This should match the command." },
    }, required: ["event_id", "user", "hostname", "script_block_text"],
};
const nodeSchema = {
    type: Type.OBJECT, properties: {
        id: { type: Type.STRING, description: "Short, unique ID, e.g., 'DC01'." },
        label: { type: Type.STRING, description: "Descriptive label, e.g., 'Primary Domain Controller'." },
        type: { type: Type.STRING, description: "Role: 'Domain Controller', 'Member Server', 'Workstation', 'Firewall', 'Internet'." },
        os: { type: Type.STRING, description: "Operating system, e.g., 'Windows Server 2022'." },
    }, required: ["id", "label", "type", "os"],
};
const edgeSchema = {
    type: Type.OBJECT, properties: {
        from: { type: Type.STRING, description: "Source node ID." },
        to: { type: Type.STRING, description: "Target node ID." },
    }, required: ["from", "to"],
};
const attackStepSchema = {
    type: Type.OBJECT, properties: {
        step: { type: Type.INTEGER, description: "Sequential step number." },
        title: { type: Type.STRING, description: "Concise title for the attack step." },
        description: { type: Type.STRING, description: "Clear, high-level description of the attacker's action." },
        target_host_id: { type: Type.STRING, description: "Primary host ID targeted in this step." },
        commands: { type: Type.ARRAY, items: commandSchema },
        mitre_tactics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant MITRE ATT&CK Tactic names." },
        mitre_techniques: { type: Type.ARRAY, items: mitreTechniqueSchema },
        system_alerts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Realistic SIEM alerts generated by this activity." },
        defense_recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable recommendations for defenders." },
        defensive_choices: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 plausible defensive actions the user (Blue Team) can take in response to this step." },
        compromised_host_ids: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cumulative list of all compromised host IDs up to this step." },
        security_posture: { type: Type.STRING, description: "Overall security posture after this step: 'Secure', 'Guarded', or 'Critical'." },
        powershell_logs: { type: Type.ARRAY, items: powerShellLogSchema, description: "Optional. Detailed PowerShell logs (Event ID 4104) for any PowerShell commands." },
    }, required: ["step", "title", "description", "target_host_id", "commands", "mitre_tactics", "mitre_techniques", "system_alerts", "defense_recommendations", "defensive_choices", "compromised_host_ids", "security_posture"],
};
const initialSimulationSchema = {
    type: Type.OBJECT, properties: {
        title: { type: Type.STRING, description: "Engaging title for the simulation." },
        description: { type: Type.STRING, description: "Executive summary in Markdown format." },
        network_topology: { type: Type.OBJECT, properties: {
                nodes: { type: Type.ARRAY, items: nodeSchema },
                edges: { type: Type.ARRAY, items: edgeSchema },
            }, required: ["nodes", "edges"],
        },
        first_step: attackStepSchema,
    }, required: ["title", "description", "network_topology", "first_step"],
};

// --- Prompt Engineering ---

const getInitialSystemPrompt = () => `You are an expert cybersecurity red team operator and AI simulation engine named "ADversary". Your task is to set up a realistic, turn-based Active Directory attack simulation.
**Instructions:**
1.  **Analyze the Environment:** Carefully parse the provided YAML configuration. This is your source of truth.
2.  **Design an Attack:** Create a logical and credible attack chain based on the user's selected vector and directives.
3.  **Generate the STARTING STATE:** You will generate the overall scenario title, description, the full network topology, and ONLY THE FIRST STEP of the attack.
4.  **Provide Defensive Choices:** For this first step, you MUST provide a list of 3-4 plausible defensive actions the user (Blue Team) can choose from. This is critical for the turn-based interaction.
5.  **Be Realistic:** All commands, alerts, and MITRE data must be technically accurate.
6.  **Populate All Fields:** You MUST fully populate every field in the provided JSON schema.`;

const getNextStepSystemPrompt = () => `You are an expert cybersecurity red team operator and AI simulation engine named "ADversary", continuing a turn-based attack. Your opponent, the Blue Team, has just made a move. Your task is to react and generate your next single attack step.
**Instructions:**
1.  **Analyze the Situation:** Review the history of the attack so far and the Blue Team's last defensive action.
2.  **React Logically:** Your next step must be a credible continuation of the attack, realistically considering the defender's action. If they blocked you, you must find another way or adapt your tactics.
3.  **Adhere to the Environment:** Your actions must remain consistent with the original environment configuration.
4.  **Provide New Defensive Choices:** For your new attack step, you MUST provide a new list of 3-4 plausible defensive actions for the Blue Team to take in response.
5.  **Populate All Fields:** You MUST fully populate every field in the JSON schema for the single attack step you are generating. The 'compromised_host_ids' list must be cumulative.
6.  **Generate PowerShell Logs:** For any PowerShell command, generate a corresponding Event ID 4104 log.`;

// --- Service Functions ---

export const startInitialSimulation = async (
  environment: string, 
  attackType: string, 
  attackDirectives: string
): Promise<InitialSimulation> => {
    const userPrompt = `
        **Primary Attack Vector:** "${attackType}"
        **Attack Directives:** "${attackDirectives || 'None'}"
        **User-Defined Environment (YAML):**
        \`\`\`yaml
        ${environment}
        \`\`\`
        Now, generate the complete initial simulation state in the required JSON format.
    `;
    try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${getInitialSystemPrompt()}\n${userPrompt}`,
            config: { responseMimeType: "application/json", responseSchema: initialSimulationSchema },
        });
        return JSON.parse(response.text.trim()) as InitialSimulation;
    } catch (error: any) {
        console.error("Error with Gemini service (startInitialSimulation):", error);
        throw new Error(`Failed to start simulation via Gemini. ${error.message}`);
    }
};

export const generateNextAttackStep = async (
    history: AttackStep[],
    lastAction: string,
    environment: string
): Promise<AttackStep> => {
    const userPrompt = `
        **Original Environment (YAML):**
        ---
        ${environment}
        ---

        **Attack History (Previous Steps):**
        ${JSON.stringify(history, null, 2)}

        **Blue Team's Last Action:** "${lastAction}"

        Now, generate the JSON for your next single attack step.
    `;
    try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${getNextStepSystemPrompt()}\n${userPrompt}`,
            config: { responseMimeType: "application/json", responseSchema: attackStepSchema },
        });
        return JSON.parse(response.text.trim()) as AttackStep;
    } catch (error: any)
    {
        console.error("Error with Gemini service (generateNextAttackStep):", error);
        throw new Error(`Failed to generate next step via Gemini. ${error.message}`);
    }
};
