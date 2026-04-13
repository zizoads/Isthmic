# Isthmic Pro — System Analysis & Architecture

## Current State: 4-Section Architecture

The Isthmic Pro system operates on a streamlined 4-section Sovereign Core Engine architecture.

### 1. Alpha Mine (Discovery & Intelligence)
The Alpha Mine is the system's primary intelligence gathering and analysis engine. It operates across multiple data tiers to identify high-value signals.

### 2. Brand Intel (Smart Intelligence)
The Brand Intel section houses the Brand Forge, a specialized tool for generating high-prestige brand identities using a Hybrid Markov-AI Synthesis Protocol.

### 3. Profile (Identity)
The Profile section manages user identity, security credentials, and external tool integrations. It enforces a strict BYOK (Bring Your Own Key) policy for the Gemini API.

### 4. Admin (System Control)
The Admin Hub is the command-and-control center for the Sovereign Engine, restricted to users with administrative privileges. It provides a Military Brief, Integrity status, and User Management.

---

## Context Layer
- **AuthContext:** Manages Firebase Authentication state and user sessions.
- **DomainContext:** Manages the state of discovered domains, brand opportunities, and interaction with the backend.
- **NavigationContext:** Handles routing between the 4 primary hubs.

## Security Layer
- **QuantumEncryption:** Real AES-GCM-256 using Web Crypto API + PBKDF2 for secure local encryption.
- **MilitaryVault:** Singleton key management for secure storage of API keys and credentials.
- **SecurityOperationsCenter:** Global error monitoring and security event logging.

## API Layer & Data Flow
- **Cloudflare Pages Function Routing:** API requests are routed through Cloudflare Pages Functions (`functions/api/[[path]].ts`).
- **Data Flow:** User action → Context → Firestore/Cloudflare Function → Gemini/HF Engine.
