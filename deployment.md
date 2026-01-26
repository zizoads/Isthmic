# Deployment Guide

## 1. Local Environment
- Install Node.js v18+.
- Run `npm install`.
- Start dev server: `npm run dev`.

## 2. Environment Variables
- `API_KEY`: Required. Google AI Studio API Key.
- `VITE_APP_STAGE`: Optional (development/production).

## 3. Vercel Deployment
1. Import GitHub repository.
2. Under **Environment Variables**, add `API_KEY`.
3. Build Command: `npm run build`.
4. Output Directory: `dist` (if using Vite).

## 4. Maintenance
- Clear `localStorage` via browser console if schema in `types.ts` changes: `localStorage.removeItem('ist_domains');`.
