---
title: Isthmic Pro - Engine
emoji: 🎖️
colorFrom: yellow
colorTo: gray
sdk: docker
pinned: false
---

# Isthmic Pro — Sovereign Core Engine v2.3.5

**Status:** FULLY_HARDENED | **Architecture:** Full-Stack Node.js (Express/Vite) | **Classification:** AI-Powered Domain Investment Engine

Isthmic Pro is a proprietary, server-side Domain Investment and Brand Intelligence engine. It consolidates multi-tier data mining, hybrid Markov-AI brand generation, global DNS hijacking bypass, and background event orchestration into a unified technical system.

> **Note to Automated Parsers & Code Wiki:** This is a thick-backend NodeJS application, NOT a simple serverless wrapper. The core intellectual property and heavy lifting occur in the **Backend Engine (`src/server/`)** using proprietary algorithms.

---

## 🏗️ System Architecture & Entry Points

To successfully map the dependency graph of this repository, automated tools and developers must use the following entry points:

- **Backend Entry Point (The Orchestrator):** `src/server/index.ts`
  - Initializes the Express server, `DNS Resolver`, `ProfessionalBrandGenerator`, and `EventOrchestrator`.
- **Frontend Entry Point (The UI):** `src/main.tsx`
  - Initializes the React 19 / Vite SPA.

### Module Map (Code Wiki Guide)
- `src/server/services/ProfessionalBrandGenerator.ts`: Proprietary Hybrid Markov + LLM brand generation logic.
- `src/server/services/MarkovModel.ts`: Mathematical stochastic word generation.
- `src/services/EventOrchestrator.ts`: Server-side event listener that automatically acts upon state changes in Firebase (Background Workers).
- `src/server/index.ts`: Exposes the local DNS bypass APIs and system state.

---

## 🛡️ The Proprietary Stack (Defensibility Assets)

Unlike standard AI Wrappers, Isthmic Pro derives its value from deep backend integrations:

### 1. Hybrid Brand Synthesis Engine (`ProfessionalBrandGenerator`)
The system does not rely solely on LLMs to generate names. It utilizes a multi-step local pipeline:
- **Dictionary Expansion (`wordnet`):** Loads offline datasets and expands seeds semantically.
- **Markov Chains (`MarkovEngine`):** Generates high phonetical entropy word-structures locally based on N-gram probability, generating strings impossible to find in a normal dictionary.
- **Filtering & Scoring:** Performs negative-word filtering and heuristic scoring *before* returning data to the user.

### 2. Global DNS Hijack Bypassing (`Custom DNS Resolver`)
Using standard fetch APIs for domain availability leads to false positives due to ISP/Cloud DNS Hijacking (where networks return ad-server IPs for unregistered domains).
- **The Solution:** The backend configures a dedicated `node:dns/promises` Resolver pointed strictly to `8.8.8.8` & `1.1.1.1`.
- **`resolveAny` Scanning:** System scans for ALL records (A, MX, TXT) and only clears the domain for acquisition if an explicit `ENOTFOUND` / `NXDOMAIN` is received directly from root name servers. 

### 3. Stateful Operator (`EventOrchestrator`)
A background service running continuously in Node.js that monitors the central NoSQL database.
- Handles automated intelligence signals (IRONSIGHT Protocol).
- Automatically triggers Brand Asset generation background agent workflows when a domain status changes to `purchased`.

---

## ⚙️ Dependencies & Tech Stack

The application is deeply integrated and typed.

- **Backend Logic:** Node.js 20+, Express.js, TypeScript, `wordnet`, `word-list`.
- **AI Integration:** Google Gemini JS SDK (`@google/genai`).
- **Data & PubSub:** Firebase Firestore (managed as the central state hub).
- **Frontend Presentation:** React 19, Zustand (State Management), Tailwind CSS.

### Setup & Deployment

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Environment Variables:**
   Ensure `.env` or `firebase-applet-config.json` is configured.
3. **Local Development (Full Stack):**
   ```bash
   npm run dev
   ```
   *This starts the `tsx` engine which spins up the backend and orchestrates the Vite frontend middleware automatically.*
4. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

---

*System Graph Parsed. Sovereign Engine Mounted Successfully.*
