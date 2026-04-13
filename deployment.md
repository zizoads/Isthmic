# Isthmic Pro — Deployment Protocol

## Infrastructure Overview

Isthmic Pro utilizes a dual-deployment strategy to separate the high-speed frontend interface from the heavy-compute intelligence engine.

- **PRIMARY FRONTEND:** Cloudflare Pages (`isthmic.com`)
- **SECONDARY BACKEND:** Hugging Face Spaces (Python Intelligence Engine)

*(Note: Previous deployments on Vercel and Render.com have been completely abandoned and decommissioned.)*

---

## 1. Primary Deployment: Cloudflare Pages

The React/Vite frontend and lightweight API routes are deployed to Cloudflare Pages, ensuring global edge distribution and minimal latency.

### Configuration
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework Preset:** Vite
- **Routing:** Handled via `functions/api/[[path]].ts` (Cloudflare Pages Functions)

### Environment Variables (Cloudflare)
The following variables must be configured in the Cloudflare Pages dashboard:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_DATABASE_ID`

*(Note: `GEMINI_API_KEY` is **NOT** set in the deployment environment. The system uses a strict BYOK (Bring Your Own Key) model where users provide their key via the Profile UI.)*

---

## 2. Secondary Deployment: Hugging Face Spaces

The heavy-compute Python intelligence engine is deployed as a Docker container on Hugging Face Spaces.

### Configuration
- **Environment:** Docker
- **Port:** `7860`
- **Sync:** Automated via GitHub Actions (`.github/workflows/sync-to-hf.yml`)

---

## 3. Firebase Integration

Firebase provides the real-time database and authentication layer. The configuration must remain strictly aligned with the `firebase-blueprint.json` schema and `firestore.rules`.

### Services Used
- **Firebase Authentication:** Google Sign-In (Primary)
- **Cloud Firestore:** Real-time data synchronization

### Firestore Collections
- `articles`
- `trends`
- `brand_opportunities`
- `users`

### Security Rules
The `firestore.rules` file contains hardened, military-grade security protocols. **Do not modify these rules without explicit authorization.** They ensure that users can only access their own data and that administrative functions remain locked down.
