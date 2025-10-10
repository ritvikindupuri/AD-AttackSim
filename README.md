# ADversary: Active Directory Threat Simulation

![ADversary Header](https://i.imgur.com/your-header-image.png) <!-- Placeholder: Replace with an actual screenshot of the app header -->

**ADversary is a professional-grade, AI-powered cyber range designed for generating hyper-realistic Active Directory (AD) attack scenarios. It empowers cybersecurity professionals, red teams, and blue teams to test, validate, and enhance their defensive posture against sophisticated threats in a dynamic and controlled environment.**

Unlike static training modules, ADversary leverages a state-of-the-art AI engine (Google Gemini) to craft unique, context-aware attack chains based *exclusively* on a user-defined environment. This strict "source-of-truth" methodology ensures that every simulation is a direct reflection of the provided network, making it an invaluable tool for practical, real-world security training and analysis.

---

## 🏛️ Core Philosophy: Grounded in Realism

In the cybersecurity industry, there is no room for ambiguity or "fake" data. ADversary was built on the principle that a simulation is only as valuable as it is realistic. To that end, the platform adheres to three core directives:

1.  **User Input is the Source of Truth:** The AI is strictly forbidden from hallucinating or inventing assets. The entire simulation—every host, IP address, security tool, and vulnerability—is logically derived from the structured environment configuration provided by the user.
2.  **Dynamic, Not Static:** Every element of the simulation is live and data-driven. The network topology, system state, and SIEM data are generated on-the-fly and evolve in real-time as the attack progresses. There is no mock data.
3.  **Professional-Grade Tooling:** The user interface and features are designed to mirror the workflow and analytical tools used by security professionals, providing an immersive and contextually relevant experience.

---

## ✨ Key Features

### 1. Structured, AI-Powered Scenario Generation
- **Structured Configuration:** Define your target AD environment using a clear, YAML-like template. Specify domain controllers, servers, workstations, and the existing security posture (EDR, firewalls, policies).
- **Grounded AI Engine:** The AI parses your configuration as a strict blueprint, ensuring every generated attack path is plausible and directly relevant to the environment you defined.
- **Attack Directives:** Refine the AI's strategy with optional, high-priority directives. Instruct it to prioritize stealth, assume initial access on a specific host, or focus on a particular end-goal.

### 2. Automated & Interactive Simulation Flow
- **Autonomous Execution:** Once generated, the simulation runs automatically, with a configurable delay between steps to mimic real-world operational tempo.
- **Full Control:** Pause and resume the simulation at any time.
- **Interactive Attack Path:** The "Attack Path" panel tracks every step. Click on any previous step to pause the simulation and instantly review the complete state of the operation at that moment in time.

### 3. Dynamic Network Topology Visualization
- **Live Network Mapping:** The AI generates a unique network map for each scenario, including realistic hostnames, roles, and a consistent private IPv4 subnet.
- **Real-Time State Tracking:** The graph is not a static image. It dynamically highlights the current target host and visually marks all compromised systems in red as the attack unfolds.

### 4. Professional SIEM Dashboard
- **Rich, Structured Event Data:** The AI generates detailed, realistic SIEM alerts for each attack step, complete with timestamps, severity levels, and descriptions.
- **Severity Analysis:** An at-a-glance dashboard provides a real-time count of events categorized by severity (Critical, High, Medium, Low).
- **Interactive Filtering & Search:** Instantly filter the event log by severity or use the live search bar to query the entire event stream for specific keywords, hostnames, or IPs, mirroring the workflow of a real SOC analyst.

### 5. In-Depth Threat Intelligence & MITRE ATT&CK® Mapping
- **Detailed Step Analysis:** Each step in the attack provides a clear title, description, and the specific adversary commands being executed.
- **Rich MITRE Tooltips:** Every tactic and technique is mapped to the MITRE ATT&CK® framework. Hover over a TTP to view a professional, AI-generated summary of its operational purpose and context.
- **Actionable Defense Recommendations:** For every attack step, the AI provides a list of concrete defense and mitigation strategies.

### 6. Full Scenario Portability
- **Import/Export Functionality:** Save a complete simulation—your inputs and all AI-generated data—to a single JSON file.
- **Share & Collaborate:** Share exported scenarios with team members to review, analyze, or re-run the exact same training exercise, ensuring consistency and enabling collaboration.

---

## 🛠️ Technology Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI Engine:** Google Gemini (via `@google/genai` SDK)
-   **Authentication:** Simulated secure, backend-ready authentication flow (React Context)
-   **Rendering:** Client-Side Rendering (CSR)

---

## 🚀 Getting Started

Follow the instructions below to get ADversary up and running.

### Prerequisites
-   A modern web browser (Chrome, Firefox, Edge).
-   [Git](https://git-scm.com/) installed on your machine.
-   A **Google Gemini API Key**. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Local Development Setup (Complete Instructions)

These steps will guide you through running the application on your local machine.

**Step 1: Clone the Repository**
Open your terminal and clone the project files to your computer.
```bash
git clone https://github.com/your-username/adversary.git
cd adversary
```

**Step 2: Configure Your API Key**
The application needs your Google Gemini API key to function. For local development, you must add it directly to the `index.html` file.

1.  Open the `index.html` file in a code editor.
2.  Locate the `<script>` block at the bottom of the file.
3.  Replace the placeholder text `'YOUR_GOOGLE_GEMINI_API_KEY_HERE'` with your actual API key.

    ```html
    <!-- ... inside index.html -->
    <script>
      window.process = {
        env: {
          API_KEY: 'YOUR_GOOGLE_GEMINI_API_KEY_HERE' // <-- PASTE YOUR KEY HERE
        }
      };
    </script>
    ```
    **Note:** This method is for local development only. Do not commit this file with your key to a public repository.

**Step 3: Serve the Application**
This is a pure client-side application. You can serve the project's root directory using any simple static file server.

-   **Using Python:**
    ```bash
    # For Python 3
    python -m http.server 8000
    ```
-   **Using Node.js (via npx):**
    ```bash
    npx serve .
    ```

**Step 4: Access the Application**
Open your web browser and navigate to the local address provided by your server (e.g., `http://localhost:8000`).

You will be greeted with the ADversary sign-in page. You can create a new (simulated) account to begin using the platform.

### Production Deployment

For deploying ADversary to a live environment (like Vercel, Netlify, or a custom server), you should **not** hardcode the API key in `index.html`. Instead, you must use the platform's environment variable management system.

1.  **Remove the Script Block:** Before deploying, remove or comment out the local development `<script>` block from `index.html`.
2.  **Set Environment Variables:** In your hosting provider's settings, configure the following environment variable:
    -   `API_KEY`: Set this to your Google Gemini API key.

The application's code is built to read `process.env.API_KEY`, and most modern deployment platforms will automatically make this variable available to the application during their build process. This is the secure and standard way to handle secrets in production.