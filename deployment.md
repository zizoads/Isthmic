
# 🚀 Production Deployment Guide (Full-Stack)

This application uses a hybrid architecture:
- **Frontend & API (Node.js/Express)**: Deployed on **Vercel**.
- **Intelligence Engine (Python/FastAPI)**: Deployed on **Hugging Face Spaces**.

---

## 1. Intelligence Engine (Hugging Face)

### Deployment Steps:
1. Create a new **Docker Space** on Hugging Face.
2. Push the contents of the `brand_intelligence/` directory to the Space.
3. Ensure the `Dockerfile` in the root of the Space is configured to run `uvicorn main:app`.
4. **Environment Variables (HF Secrets)**:
   - `FIREBASE_CREDENTIALS`: (Optional) JSON string of your Firebase service account for persistent storage.

### Verification:
- Access `https://your-space-name.hf.space/api/health`. It should return `{"status": "ok"}`.

---

## 2. Frontend & API Gateway (Vercel)

### Deployment Steps:
1. Connect your GitHub repository to **Vercel**.
2. **Framework Preset**: Other (Vercel will detect `vercel.json`).
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables (Vercel)**:
   - `GEMINI_API_KEY`: Your Google AI Studio API Key.
   - `PYTHON_ENGINE_URL`: The URL of your Hugging Face Space (e.g., `https://user-name-space.hf.space`).
   - `NODE_ENV`: `production`

### Architecture Note:
- The entry point for Vercel is `api/index.ts`. 
- All requests to `/api/*` are proxied to the Python engine or handled by the local Express routes.

---

## 3. Firebase Integration (Persistence)

1. Go to Firebase Console > Project Settings > Service Accounts.
2. Generate a new private key (JSON).
3. Copy the JSON content and add it as `FIREBASE_CREDENTIALS` in Hugging Face Secrets.
4. Ensure `firebase-applet-config.json` is present in the root for client-side Firebase features.

---

## 4. Post-Deployment Audit Checklist

1. ✅ **Health Check**: Visit `/api/health_proxy` to verify the connection between Vercel and Hugging Face.
2. ✅ **Brand Generation**: Run a "Niche Generation" to test the Markov/Scoring engine.
3. ✅ **Crawl Test**: Start a "Crawl" operation and monitor the logs in Hugging Face to ensure the agents are active.
4. ✅ **UI Integrity**: Verify that the "Alpha Mine" dashboard correctly displays data fetched from the Python engine.
5. ✅ **Language Support**: Switch to Arabic to ensure RTL (Right-to-Left) layouts are preserved in production.

---

## 5. Troubleshooting (Common Issues)

| Issue | Root Cause | Solution |
|-------|------------|----------|
| **502 Bad Gateway** | Python engine is sleeping or URL is wrong. | Check `PYTHON_ENGINE_URL` and wake up the HF Space. |
| **ModuleNotFoundError** | Incorrect `PYTHONPATH` or imports. | Ensure `main.py` uses the `try-except` import pattern. |
| **404 on API** | Vercel didn't find `api/index.ts`. | Check `vercel.json` rewrites and file location. |
| **Quota Exceeded** | Gemini API limits reached. | Upgrade to a paid tier or rotate API keys. |
