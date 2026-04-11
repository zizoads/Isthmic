---
title: Isthmic Pro
emoji: 🎖️
colorFrom: yellow
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---

# 🎖️ Isthmic Pro: Sovereign Core v3.0.0

Isthmic Pro is a high-prestige, multi-agent strategic engine designed for elite domain acquisition and brand intelligence. It operates on a "Sovereign" architecture, combining real-time market signals with deep AI synthesis to identify and forge digital assets.

---

## 🏗️ System Architecture (The Sovereign Mesh)

Isthmic Pro is built on a distributed service mesh where specialized agents collaborate autonomously.

### 1. 🕵️ Sovereign Event Orchestrator (The Ghost Engine)
The core of the system is the **EventOrchestrator** (`src/services/EventOrchestrator.ts`). This is a server-side background service that monitors the state of the digital frontier (Firestore) and triggers autonomous workflows:
*   **Autonomous Auditing**: When a new domain is identified, the Orchestrator automatically triggers a background audit to calculate DA/PA, Liquidity Scores, and Trademark Risks.
*   **Identity Synthesis**: Upon domain acquisition, it triggers the **ProfessionalBrandGenerator** to synthesize a unique brand DNA (Taglines, Visual Seeds, and Color Palettes).
*   **Signal Boosting**: It listens to the **IRONSIGHT Protocol** (Market Signals) and dynamically adjusts asset probabilities based on global trends.

### 2. 🧠 Master Brain Engine
Located in `src/services/masterBrainEngine.ts`, this engine handles high-level strategic decomposition. It takes an investment thesis and breaks it down into executable nodes (Discovery, Forensic, Liquidation).

### 3. 🛡️ Sovereign Shield & Military Vault
*   **Sovereign Shield**: Handles local data sovereignty, ensuring that sensitive session data remains encrypted and local-first.
*   **Military Vault**: A secure abstraction for API key management, supporting "Bring Your Own Key" (BYOK) protocols for Gemini and other strategic tools.

### 4. ⚡ High-Speed Database Engine
A low-latency abstraction layer (`src/services/HighSpeedDatabaseEngine.ts`) that manages real-time telemetry and structural stability checks, ensuring the system remains responsive under heavy analytical loads.

---

## 🚀 Key Features

### 💎 Alpha Mine (Discovery & Audit)
A high-velocity interface for scanning the digital frontier.
*   **Real-time Trend Analysis**: Powered by Gemini 3 Flash Preview to identify emerging tech vectors.
*   **Strategic Opportunity Synthesis**: Automatically generates brand opportunities based on detected market gaps.

### ⚒️ Brand Forge (Identity Synthesis)
A hybrid Markov-AI engine for forging high-prestige brand identities.
*   **Phonetic Resonance Audit**: Calculates the "sound" quality of a brand name using alliteration and consonance algorithms.
*   **Semantic Alignment**: Uses LLMs to ensure the brand name aligns perfectly with the target market niche.

### 📊 Admin Control (System Oversight)
A command-and-control center for monitoring system health, agent performance, and database integrity.

---

## 🛠️ Technical Stack

*   **Frontend**: React 18, Vite, Tailwind CSS, Motion (Animations).
*   **Backend**: Node.js (Express) with Vite Middleware.
*   **AI Engine**: Google Gemini 3.1 Pro Preview & 3 Flash Preview (via `@google/genai`).
*   **Database**: Firebase Firestore (Real-time synchronization).
*   **Security**: Custom AES-256 encryption (Sovereign Shield).

---

## 🚀 Deployment & Configuration

### 1. Environment Configuration
*   **GEMINI_API_KEY**: Your Google Gemini API key (Required for AI features).

### 2. Installation
```bash
npm install
npm run dev
```

### 3. Production Build
```bash
npm run build
npm start
```

---

## 📜 Sovereign Protocols
*   **IRONSIGHT**: Market signal monitoring and probability boosting.
*   **PHOENIX**: Automatic recovery and state persistence.
*   **PHI (Cohesion Index)**: Real-time calculation of system stability and launch readiness.

---

*Developed for the elite. Built for sovereignty.*
