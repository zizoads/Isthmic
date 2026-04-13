# Isthmic Pro — System Analysis & Architecture

## Current State: 4-Section Architecture

The Isthmic Pro system has been streamlined from its previous experimental architectures (e.g., 16 agents, 5 hubs) into a highly focused, 4-section Sovereign Core Engine. This consolidation ensures maximum performance, security, and operational clarity.

### 1. Alpha Mine (Discovery & Audit)
The Alpha Mine is the system's primary intelligence gathering and analysis engine. It operates across multiple data tiers to identify high-value signals.

**Responsibilities:**
- **Multi-Tier Source Ingestion:** Aggregates data from Early Signals (HackerNews, ArXiv, etc.), Money Signals (CrunchBase, AngelList, etc.), Job Markets, Patents, and Media.
- **Signal Processing:** Applies configurable weights to different sources (e.g., Funding=5, Patents=4).
- **Optimization Loop:** Continuously refines data based on target scores, recency, and validation signals.
- **Filtering:** Enforces strict criteria such as `.COM Only` and specific naming styles (e.g., `Merged(TechCrunch)`).

### 2. Brand Intel (Smart Intelligence)
The Brand Intel section houses the Brand Forge, a specialized tool for generating high-prestige brand identities.

**Responsibilities:**
- **Hybrid Markov-AI Synthesis:** Combines Markov chain logic with AI to produce phonetically resonant and semantically aligned brand names.
- **Template Management:** Provides quick-start templates for various high-value niches (e.g., Cyber Security, Fintech Elite).
- **Identity Generation:** Processes user-defined market niches and seed keywords to forge new brand assets.

### 3. Profile (Identity)
The Profile section manages user identity, security credentials, and external tool integrations.

**Responsibilities:**
- **BYOK (Bring Your Own Key) Management:** Securely stores and manages the user's Gemini API key locally, ensuring the system never proxies or centrally stores sensitive AI credentials.
- **Custom Tool Configuration:** Allows users to integrate and configure external intelligence tools such as Estibot, Semrush, Ahrefs, USPTO, and Hunter.io.

### 4. Admin (System Control)
The Admin Hub is the command-and-control center for the Sovereign Engine, restricted to users with administrative privileges.

**Responsibilities:**
- **Military Brief:** Provides a high-level, real-time overview of system operations and active protocols.
- **System Integrity:** Monitors and displays the status of critical security infrastructure, including the Firewall, Quantum Encryption, and Sovereign Shield.
- **User Management:** Enables administrators to oversee active users, modify roles, and manage access permissions.
- **Performance Metrics:** Tracks and visualizes Vault Health and Network Load.

---

## Data Architecture (Firebase)

The system relies on a hardened Firebase Firestore implementation for its data layer.

- **`articles`**: Stores ingested media and signal data.
- **`trends`**: Houses analyzed market trends and vectors.
- **`brand_opportunities`**: Contains synthesized brand identities and market gaps.
- **`users`**: Manages user profiles, roles, and encrypted configurations.

*Note: The `firestore.rules` and `firebase-blueprint.json` files enforce strict security and schema validation across all collections.*
