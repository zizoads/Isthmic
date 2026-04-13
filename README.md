---
title: Isthmic Pro
emoji: 🎖️
colorFrom: yellow
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---

# Isthmic Pro — Sovereign Core Engine v2.3

**Status:** FULLY_HARDENED | **Deployment:** Cloudflare Pages + Hugging Face Spaces

Isthmic Pro is a sovereign intelligence and brand synthesis engine. Designed for precision, speed, and absolute control, it consolidates multi-tier data mining, AI-driven brand generation, and system integrity management into a unified, military-grade interface.

[Live System Access](https://isthmic.com)

---

## 🛡️ Core Architecture (4 Sections)

The Sovereign Core Engine operates through four primary hubs, each dedicated to a specific operational directive:

### 1. Alpha Mine (Discovery & Audit)
A multi-tier source analysis engine designed to extract high-value signals from the noise.
- **5-Tier Source System:**
  - *Early Signals:* HackerNews, ArXiv, GitHub Trending, ProductHunt
  - *Money Signals:* CrunchBase, AngelList, YCombinator, SEC Edgar
  - *Job Market:* LinkedIn, WellFound, Indeed
  - *Patents:* USPTO, GooglePatents, WIPO
  - *Media:* TechCrunch, TheVerge, Wired, MITTechReview, VentureBeat, TechRadar, BetaList
- **Optimization Loop:** Configurable iterations, target score (0.85), recency days (60), minimum signals (2), minimum score (55), and max per sector (2).
- **Filters:** .COM Only active, Naming Style: Merged(TechCrunch).
- **Source Weights:** Articles=1, Patents=4, Startups=3, Jobs=3, Funding=5.

### 2. Brand Intel (Smart Intelligence)
The Brand Forge utilizes a Hybrid Markov-AI Synthesis Protocol to generate high-prestige, phonetically resonant brand identities.
- **Quick Templates:** AI & Neural Tech, Fintech Elite, Cyber Security, Autonomous Agents, Data Intelligence, Cloud Infrastructure, Generative AI, Smart Robotics.
- **Input Parameters:** Market Niche + Seed Keywords.
- **Security:** Secure Protocol indicator active.

### 3. Profile (Identity)
Sovereign identity configuration and API key management.
- **BYOK (Bring Your Own Key):** Secure integration for the Gemini API.
- **Custom Tools Integration:** User-configurable access to Estibot, Semrush, Ahrefs, USPTO, and Hunter.io.

### 4. Admin (System Control)
The central command center for monitoring system health and user access.
- **Military Brief:** High-level overview of system status and active protocols.
- **Integrity:** System Audit function, Firewall, Quantum Encryption, and Sovereign Shield status.
- **User Management:** Control over user roles and access permissions.
- **Metrics:** Real-time Vault Health and Network Load display.

---

## ⚙️ Tech Stack & Infrastructure

- **Frontend:** React 19, Vite 7, TypeScript 5.3, Tailwind CSS 3.4, Motion 12, Three.js 0.183, Recharts 3.7
- **AI Integration:** `@google/genai` (^1.38.0)
- **State & Data:** Zustand 4.5, TanStack React Query 5
- **Backend/API:** Express 5 + tsx, Cloudflare Workers (`@cloudflare/workers-types`)
- **Testing:** Vitest 4, Playwright 1.58

### Firebase Data Model
The system relies on Firebase 12 (Firestore + Auth) for secure, real-time data synchronization.
- **Collections:** `articles`, `trends`, `brand_opportunities`, `users`
- **Security:** Hardened `firestore.rules` and strict schema enforcement via `firebase-blueprint.json`.

---

## 🚀 Deployment Protocol

- **PRIMARY:** Cloudflare Pages (`isthmic.com`)
- **SECONDARY:** Hugging Face Spaces (Docker, port 7860) for the Python intelligence engine.

*(Note: Vercel and Render.com deployments have been abandoned and are no longer in use.)*

---

## 🔐 Security & BYOK System

Isthmic Pro enforces a strict **Bring Your Own Key (BYOK)** policy for AI operations. The system does not store or proxy Gemini API keys centrally; users must provide their own keys via the Profile section. This ensures absolute sovereignty over AI usage and costs.

---

*Sovereign Engine Mounted Successfully. Security Operations Center monitoring active.*
