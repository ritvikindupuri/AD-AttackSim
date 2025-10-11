# ADversary: Active Directory Threat Simulation

![ADversary Header](https://i.imgur.com/your-header-image.png) <!-- Placeholder: Replace with an actual screenshot of the app header -->

**ADversary is a professional-grade, AI-powered cyber range designed for generating hyper-realistic Active Directory (AD) attack scenarios. It empowers cybersecurity professionals, red teams, and blue teams to test, validate, and enhance their defensive posture against sophisticated threats in a dynamic and controlled environment.**

Unlike static training modules, ADversary leverages state-of-the-art AI engines (including Google Gemini and OpenAI GPT) to craft unique, context-aware attack chains based *exclusively* on a user-defined environment. This strict "source-of-truth" methodology ensures that every simulation is a direct reflection of the provided network, making it an invaluable tool for practical, real-world security training and analysis.

---

## 🏛️ Core Philosophy: Grounded in Realism

In the cybersecurity industry, there is no room for ambiguity or "fake" data. ADversary was built on the principle that a simulation is only as valuable as it is realistic. To that end, the platform adheres to three core directives:

1.  **User Input is the Source of Truth:** The AI is strictly forbidden from hallucinating or inventing assets. The entire simulation—every host, IP address, security tool, and vulnerability—is logically derived from the structured environment configuration provided by the user.
2.  **Dynamic, Not Static:** Every element of the simulation is live and data-driven. The network topology, system state, and security event logs are generated on-the-fly and evolve in real-time as the attack progresses. There is no mock data.
3.  **Professional-Grade Tooling:** The user interface and features are designed to mirror the workflow and analytical tools used by security professionals, providing an immersive and contextually relevant experience.

---

## ✨ Key Features

### 1. Multi-Provider AI Scenario Generation
- **Flexible AI Engine:** Choose between powerful AI providers like **Google Gemini** or **OpenAI GPT** to generate scenarios.
- **Structured Configuration:** Define your target AD environment using a clear, YAML-like template. Specify domain controllers, servers, workstations, and the existing security posture (EDR, firewalls, policies).
- **Grounded AI Engine:** The AI parses your configuration as a strict blueprint, ensuring every generated attack path is plausible and directly relevant to the environment you defined.
- **Attack Directives:** Refine the AI's strategy with optional, high-priority directives. Instruct it to prioritize stealth, assume initial access on a specific host, or focus on a particular end-goal.

### 2. Automated & Interactive Simulation Flow
- **Autonomous Execution:** Once generated, the simulation runs automatically, with a configurable delay between steps to mimic real-world operational tempo.
- **Full Control:** Pause and resume the simulation at any time.
- **Interactive Attack Path:** The "Attack Path" panel tracks every step. Click on any previous step to pause the simulation and instantly review the complete state of the operation at that moment in time.

### 3. Dynamic Network Topology Visualization
- **Live Network Mapping:** The AI generates a unique network map for each scenario, rendered in a professional, deterministic tiered layout to ensure clarity.
- **Real-Time State Tracking:** The graph is not a static image. It dynamically highlights the current target host and visually marks all compromised systems in red as the attack unfolds.

### 4. Adversary Event Log
- **Rich, Structured Event Data:** The AI generates detailed, realistic security alerts for each attack step, complete with progressing timestamps and parsed source hostnames.
- **Severity Analysis:** Events are automatically categorized by severity (Critical, Warning, Info) and color-coded for at-a-glance analysis.
- **Realistic Interface:** The event log mimics the look and feel of a real security analysis tool, providing an immersive experience.

### 5. In-Depth Threat Intelligence & MITRE ATT&CK® Mapping
- **Detailed Step Analysis:** Each step in the attack provides a clear title, description, and the specific adversary commands being executed.
- **Rich MITRE Tooltips:** Every tactic and technique is mapped to the MITRE ATT&CK® framework in a clear, hierarchical view. Hover over any TTP to view a professional, AI-generated summary of its purpose.
- **Actionable Defense Recommendations:** For every attack step, the AI provides a list of concrete defense and mitigation strategies.

### 6. Full Scenario Portability
- **Import/Export Functionality:** Save a complete simulation—your inputs and all AI-generated data—to a single JSON file.
- **Share & Collaborate:** Share exported scenarios with team members to review, analyze, or re-run the exact same training exercise, ensuring consistency and enabling collaboration.

---

## 🛠️ Technology Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI Engines:** Google Gemini (via `@google/genai` SDK), OpenAI GPT (via REST API)
-   **Authentication:** Simulated secure, backend-ready authentication flow (React Context)
-   **Rendering:** Client-Side Rendering (CSR)

---

## 🚀 Getting Started

Follow the instructions below to get ADversary up and running.

### Prerequisites
-   A modern web browser (Chrome, Firefox, Edge).
-   An API Key from your chosen provider:
    -   **Google Gemini:** Obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   **OpenAI:** Obtain one from the [OpenAI Platform](https://platform.openai.com/api-keys).

### Local Development Setup

This is a pure client-side application. You can serve the project's root directory using any simple static file server.

**Step 1: Serve the Application**
If you have the project files locally, open your terminal in the project's root directory and use a simple server.

-   **Using Python:**
    ```bash
    # For Python 3
    python -m http.server 8000
    ```
-   **Using Node.js (via npx):**
    ```bash
    npx serve .
    ```

**Step 2: Access and Configure the Application**
Open your web browser and navigate to the local address provided by your server (e.g., `http://localhost:8000`).

1.  You will be greeted with the ADversary sign-in page. Create a new (simulated) account to begin.
2.  Once logged in, click the **"Settings"** button in the top-right corner.
3.  In the modal that appears, **select your desired AI Provider** from the dropdown (e.g., "Google Gemini" or "OpenAI").
4.  Paste your corresponding **API Key** into the input field and click **"Save & Close"**.

The application is now configured and ready to use.

### Production Deployment

For deploying ADversary to a live environment (like Vercel, Netlify, or a custom server), the process remains user-centric. There are no build steps or environment variables to configure for API keys. Users of your deployed instance will be prompted to enter their own API key in the settings, just as they would during local development. This ensures that your production deployment does not need to manage or secure any API credentials itself.