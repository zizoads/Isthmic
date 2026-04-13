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

Isthmic Pro is an AI-powered brand intelligence and digital asset discovery platform. Designed for precision, speed, and absolute control, it consolidates multi-tier data mining, AI-driven brand generation, and system integrity management into a unified, military-grade interface.

[Live System Access](https://isthmic.com)

---

## 🛡️ Core Architecture (4 Sections)

The Sovereign Core Engine operates through four primary hubs, each dedicated to a specific operational directive:

### 1. Alpha Mine (Discovery & Intelligence)
A multi-tier source analysis engine designed to extract high-value signals from the noise.
- **5-Tier Source System:** Early Signals, Money Signals, Job Market, Patents, Media.
- **Optimization Loop:** Configurable iterations, target score, recency days, minimum signals, minimum score, and max per sector.

### 2. Brand Intel (Smart Intelligence)
The Brand Forge utilizes a Hybrid Markov-AI Synthesis Protocol to generate high-prestige, phonetically resonant brand identities.
- **Quick Templates:** AI & Neural Tech, Fintech Elite, Cyber Security, Autonomous Agents, Data Intelligence, Cloud Infrastructure, Generative AI, Smart Robotics.
- **Input Parameters:** Market Niche + Seed Keywords.

### 3. Profile (Identity)
Sovereign identity configuration and API key management.
- **BYOK (Bring Your Own Key):** Secure integration for the Gemini API. The system does not store or proxy Gemini API keys centrally; users must provide their own keys via the Profile section.
- **Custom Tools Integration:** User-configurable access to external tools.

### 4. Admin (System Control)
The central command center for monitoring system health and user access.
- **Military Brief:** High-level overview of system status and active protocols.
- **Integrity:** System Audit function, Firewall, Quantum Encryption, and Sovereign Shield status.
- **User Management:** Control over user roles and access permissions.

---

## ⚙️ Tech Stack & Infrastructure

- **Frontend:** React 19, Vite 7, TypeScript, Tailwind
- **AI Integration:** Google Gemini API (BYOK)
- **Database & Auth:** Firebase Firestore + Auth
- **Deployment:** Cloudflare Pages (primary), Hugging Face Spaces (Python engine)

### Firebase Data Model
The system relies on Firebase for secure, real-time data synchronization.
- **Collections:** `articles`, `trends`, `brand_opportunities`, `users`

### Security
- **Sovereign Shield & Quantum Encryption:** Real AES-GCM-256 using Web Crypto API + PBKDF2 for secure local encryption.

---

## 🚀 Setup & Deployment

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Configure Firebase:**
   Ensure `firebase-applet-config.json` is configured with your Firebase credentials.
3. **Cloudflare Configuration:**
   Set `GEMINI_API_KEY` in your Cloudflare Pages environment variables.
4. **Build & Deploy:**
   ```bash
   npm run build
   wrangler pages deploy dist
   ```

---

*Sovereign Engine Mounted Successfully. Security Operations Center monitoring active.*
