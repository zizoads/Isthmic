# Isthmic Pro — Deployment Protocol

## Infrastructure Overview

Isthmic Pro utilizes a dual-deployment strategy to separate the high-speed frontend interface from the heavy-compute intelligence engine.

- **PRIMARY FRONTEND:** Cloudflare Pages (`isthmic.com`)
- **SECONDARY BACKEND:** Hugging Face Spaces (Python Intelligence Engine)

---

## 1. Primary Deployment: Cloudflare Pages

The React/Vite frontend and lightweight API routes are deployed to Cloudflare Pages.

### Configuration
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework Preset:** Vite
- **Routing:** Handled via `functions/api/[[path]].ts` (Cloudflare Pages Functions)

### Environment Variables (Cloudflare)
The following variables must be configured in the Cloudflare Pages dashboard:
- `GEMINI_API_KEY`
- `PYTHON_ENGINE_URL` (in `wrangler.toml`)

---

## 2. Secondary Deployment: Hugging Face Spaces

The heavy-compute Python intelligence engine is deployed as a Docker container on Hugging Face Spaces.

### Configuration
- **Environment:** Docker
- **Port:** `7860`
- **CI/CD:** Automated sync via GitHub Actions (`.github/workflows/sync-to-hf.yml`)

---

## 3. Database & Authentication: Firebase

Firebase provides the real-time database and authentication layer.

### Services Used
- **Firebase Authentication:** Google Sign-In and Email/Password
- **Cloud Firestore:** Real-time data synchronization

### Firestore Collections
- `articles`
- `trends`
- `brand_opportunities`
- `users`
