# 🚀 Domainer Pro: Technical Command Center
### *Industrial-Grade Multi-Agent AI Platform for Strategic Domain Investment*

Domainer Pro is a sophisticated, high-fidelity React application designed for professional domain investors. It leverages the **Gemini 3 Pro** engine to automate the end-to-end lifecycle of domain flipping—from discovery and forensic appraisal to outreach and tactical negotiation.

---

## 🏗️ System Architecture

The platform is built on a modular **Multi-Agent Architecture** where specialized AI nodes coordinate through a central "Master Brain."

### 1. Frontend Stack
- **Framework:** React 19 (Functional Components & Hooks).
- **Type Safety:** Strict TypeScript implementation for business logic and API contracts.
- **Styling:** Tailwind CSS using an industrial-dark "Glassmorphism" aesthetic.
- **Visualizations:** `Recharts` for real-time portfolio analytics and sector distribution.
- **State Persistence:** LocalStorage-based synchronization for cross-session data integrity.

### 2. AI Intelligence Layer (Gemini SDK)
The core intelligence resides in `services/geminiService.ts`, utilizing:
- **Model:** `gemini-3-pro-preview` for high-stakes reasoning.
- **Thinking Budget:** Configured between 6,000 to 8,000 tokens per request to enable deep "Chain of Thought" (CoT) processing.
- **Grounding Tool:** `googleSearch` is integrated into discovery and evaluation prompts to fetch live market data, comparable sales (Comps), and trademark status.
- **Resilience Protocol:** An "Autonomous Recovery" logic that falls back to `gemini-3-flash-preview` and simulated data if primary API connections are throttled or unavailable.

---

## 🤖 Neural Agent Modules

### 🎯 Strategic Sniper (Discovery)
- **Logic:** Scans unlisted inventories and registrar feeds.
- **Verification:** Cross-references findings with NameBio-style historical data via search grounding.
- **Output:** Returns high-probability investment candidates with justification scores.

### 🛡️ Forensic Appraiser (Evaluation)
- **Forensics:** Analyzes domain history cleaness and backlink profiles using search snippets (simulating Moz/Ahrefs).
- **Risk Audit:** Performs trademark collision checks via USPTO/WIPO search grounding.
- **Reasoning:** Displays the "Chain of Thought" in the **Agent Reasoning Lab** for human-in-the-loop verification.

### 💼 Master Brain (Orchestrator)
- **Control:** Manages the **Commander's Intent**, setting budget caps, ROI targets, and risk tolerance.
- **Stats Engine:** Aggregates portfolio value, spent capital, and system resilience scores.

### ✉️ Outreach & Negotiation War Room
- **Leads:** Identifies corporate decision-makers (CEOs/Marketing Managers) using Hunter.io-style logic.
- **Tactics:** Analyzes buyer sentiment to generate "Battlecard" responses and suggested counter-offers.

---

## 🔌 Integration Ecosystem

The platform features a **Service Integration Center** that manages connections to five strategic "senses":
1.  **NameBio:** Historical sales benchmark data.
2.  **Hunter.io:** Strategic lead harvesting.
3.  **WhoisXML:** Ownership and lifecycle verification.
4.  **Moz SEO:** Domain Authority (DA) and technical metrics.
5.  **Escrow.com:** Financial settlement simulation.

**Resilience Feature:** When an integration is `simulated`, the AI uses **Grounded Deduction** to estimate parameters, ensuring the platform remains functional without active API keys.

---

## 📂 Project Structure

```text
├── services/
│   └── geminiService.ts    # AI logic, grounding, and JSON schemas
├── components/
│   ├── MasterBrain.tsx     # Executive command & stats
│   ├── Discovery.tsx       # Search & Sniper engine
│   ├── Evaluation.tsx      # Deep audit & reasoning console
│   ├── Pipeline.tsx        # Kanban-style asset management
│   ├── ExecutiveReport.tsx # Synthesis of market intelligence
│   └── ...                 # Specialized agent dashboards
├── types.ts                # Strict interfaces for Domains, Stats, and Strategies
├── App.tsx                 # Central orchestrator & state manager
└── metadata.json           # Platform descriptors
```

---

## 🚀 Operational Logic

### Data Integrity & Resilience
The system calculates a **Data Integrity Score** based on the status of external integrations. If the score is `< 100%`, the system enters "Degraded Operation Mode," where the AI explicitly reasons through missing data points to provide the most accurate possible estimates.

### Reasoning Console
The `AgentReasoningLab` component provides transparency into how the AI reached a specific valuation. It breaks down the grounding sources, comparable sales found, and the logical steps of the appraisal.

---

## 📜 Legal & Operational Disclaimer
Domainer Pro is a decision-support system. While it utilizes advanced grounding and thinking budgets, all financial transactions and trademark audits should be subject to final human review before capital deployment.

---
**Technical Documentation for Version 2.5.0-Industrial.**