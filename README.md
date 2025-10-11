# ADversary: Active Directory Threat Simulation

![ADversary Header](https://i.imgur.com/your-header-image.png) <!-- Placeholder: Replace with an actual screenshot of the app header -->

**ADversary is a professional-grade, AI-powered cyber range where you go head-to-head with an AI Red Team agent. It is designed for generating hyper-realistic, interactive Active Directory (AD) attack scenarios that test your defensive intuition in real-time.**

Unlike static training modules that play out a pre-generated script, ADversary leverages the state-of-the-art **Google Gemini** AI to act as a dynamic adversary. You, the user, play as the Blue Team. After each attack step, the simulation pauses, and you must choose a defensive action. Your choice directly influences the AI's next move, creating a unique, unpredictable, and deeply engaging training experience.

---

## 🏛️ Core Philosophy: Grounded in Realism

In the cybersecurity industry, there is no room for ambiguity or "fake" data. ADversary was built on the principle that a simulation is only as valuable as it is realistic. To that end, the platform adheres to three core directives:

1.  **User Input is the Source of Truth:** The AI is strictly forbidden from hallucinating or inventing assets. The entire simulation—every host, IP address, security tool, and vulnerability—is logically derived from the structured environment configuration provided by the user.
2.  **Dynamic, Not Static:** Every element of the simulation is live and data-driven. The network topology, system state, and security event logs are generated on-the-fly and evolve in real-time as the attack progresses based on your actions.
3.  **Professional-Grade Tooling:** The user interface and features are designed to mirror the workflow and analytical tools used by security professionals, providing an immersive and contextually relevant experience.

---

## ✨ Key Features

### 1. Interactive 'Human vs. AI' Agent Simulation
-   **Turn-Based Gameplay:** Experience a dynamic, "chess-like" simulation. The AI Red Team makes a move, and then you, the Blue Team, must choose a defensive counter-move from a list of plausible actions.
-   **Reactive AI Opponent:** Your defensive choices are fed back to the Gemini model, which is forced to react. If you isolate a host, the AI must find a new pivot. If you reset a credential, it must adapt its tactics. No two simulations are the same.
-   **Strategic Decision Making:** This model moves beyond passive learning, forcing you to make critical incident response decisions under pressure and see the immediate consequences of your actions.

### 2. Gemini-Powered AI Scenario Generation
-   **Optimized AI Engine:** Powered by **Google Gemini** for high-fidelity, structured, and reliable scenario creation.
-   **Structured Configuration:** Define your target AD environment using a clear YAML template. Specify domain controllers, servers, workstations, and the existing security posture.
-   **Grounded AI Engine:** The AI parses your configuration as a strict blueprint, ensuring every generated attack path is plausible and directly relevant to the environment you defined.

### 3. Dynamic Network Topology Visualization
-   **Live Network Mapping:** The AI generates a unique network map for each scenario, rendered in a professional layout.
-   **Real-Time State Tracking:** The graph is not a static image. It dynamically highlights the current target host and visually marks all compromised systems in red as the attack unfolds.

### 4. Forensic-Level PowerShell Logging
-   **Detailed Event Data:** For every relevant command, the AI generates a corresponding PowerShell Script Block Log (Event ID 4104), a critical artifact for defenders.
-   **Realistic Analysis:** These logs are presented in a dedicated "PowerShell Events" tab, mimicking the view a security analyst would have when investigating an incident.

### 5. In-Depth Threat Intelligence & MITRE ATT&CK® Mapping
-   **Detailed Step Analysis:** Each step in the attack provides a clear title, description, and the specific adversary commands being executed.
-   **Actionable Defense Recommendations:** For every attack step, the AI provides a list of concrete defense and mitigation strategies.
-   **Rich MITRE Explanations:** Every tactic and technique is mapped to the MITRE ATT&CK® framework in a clear, hierarchical view.

### 6. Full Scenario Portability
-   **Import/Export Functionality:** Save a complete simulation—your inputs and all AI-generated data from an interactive session—to a single JSON file.
-   **Share & Collaborate:** Share exported scenarios with team members to review and analyze the unique attack path that was created.

---

## 🛠️ Technology Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI Engine:** Google Gemini (via `@google/genai` SDK)
-   **Authentication:** Simulated secure, backend-ready authentication flow (React Context)
-   **Rendering:** Client-Side Rendering (CSR)

---

## 🚀 Getting Started

This application is designed to be run in an environment where the Google Gemini API key is pre-configured as an environment variable (`API_KEY`).

### Prerequisites
-   A modern web browser (Chrome, Firefox, Edge).
-   A Google Gemini API Key obtained from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Local Development / Deployment
This is a pure client-side application that reads the API key from its hosting environment.

**Step 1: Configure the API Key**
The application is hardcoded to look for the API key in `process.env.API_KEY`. You must ensure this variable is available in the environment where you serve the application. How you do this depends on your hosting platform (e.g., setting secrets in Vercel/Netlify, or using a `.env` file with a local development server that supports it).

**Step 2: Serve the Application**
If you have the project files locally, open your terminal in the project's root directory and use a simple static file server.

-   **Using Python:**
    ```bash
    # For Python 3
    python -m http.server 8000
    ```
-   **Using Node.js (via npx):**
    ```bash
    npx serve .
    ```

**Step 3: Access the Application**
Open your web browser and navigate to the local address provided by your server (e.g., `http://localhost:8000`).

1.  You will be greeted with the ADversary sign-in page. Create a new (simulated) account to begin.
2.  Once logged in, the application is ready to use. The AI provider is automatically set to Google Gemini.

The application is now configured and ready to generate simulations.