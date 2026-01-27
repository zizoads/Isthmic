
# Production Deployment Guide

## 1. Local Verification
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Type Check
npm run lint

# Build Verification
npm run build
```

## 2. Environment Variables (Required)
- `API_KEY`: Industrial-grade Google GenAI Key.

## 3. Vercel / Netlify Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `./`

## 4. Post-Deployment Audit
1. Access URL.
2. Toggle Dark Mode.
3. Switch Language to Arabic.
4. Open Command Palette (`Ctrl+K`).
5. Run one "Master Brain Scan" to verify API and Google Search Grounding.
6. Verify "Brand DNA" generation creates a logo image.
