# Isthmic Pro: Domainer Enterprise Suite

## 1. Project Title
**Isthmic Pro** — The Elite AI Command Center for Digital Asset Management.

## 2. Short Description
An industrial-grade platform designed for professional domainers, using multi-agent AI to automate the entire lifecycle of a domain: from discovery and forensic audit to branding and final liquidation.

## 3. Functional Description
1. **Master Brain Strategy**: Set your "Commander's Intent" to guide all AI agents.
2. **Precision Discovery**: Real-time market scanning via grounded AI search.
3. **Forensic Valuation**: Trademark risk checking and market comp verification.
4. **Brand Synthesis**: Instant logo, tagline, and business concept generation.
5. **Direct Liquidation**: Automated corporate prospecting and Afternic optimization.

## 4. Architecture Diagram
```ascii
[ User Intent ] --> [ Master Brain ]
                         |
       +-----------------+-----------------+
       |                 |                 |
 [ Discovery ] --> [ Evaluation ] --> [ Portfolio ]
       |                 |                 |
 [ Pipeline  ] <--- [ Audit Lab ] <--- [ Branding ]
       |
 [ Messaging ] --> [ Marketplace ] --> [ SOLD ]
```

## 5. Dependency Tree
1. **Core**: React 19 (ESM), TypeScript.
2. **AI**: `@google/genai` (Gemini 3 Pro/Flash).
3. **Visuals**: Tailwind CSS, FontAwesome 6.
4. **Data**: Recharts, LocalStorage API.

## 6. Installation & Local Run
1. `npm install`
2. `npm run dev`
3. Access at `http://localhost:3000` (Assumes Vite default).

## 7. Environment Variables & Defaults
- `API_KEY`: Required (via `process.env`). Accesses Gemini models.
- `localStorage`: Used for all domain state and strategy persistence.

## 8. Deployment (Vercel) Steps
1. Connect GitHub repo to Vercel.
2. Set `API_KEY` in Environment Variables.
3. Use `npm run build` as build command.

## 10. Testing/Validation Instructions
- Trigger "Master Brain Scan" to verify `rigorousDiscoveryAI` logic.
- Inspect `PipelineDashboard` to verify state transitions between agents.

## 11. CLI Commands List
- `npm run dev`: Development server.
- `npm run build`: Production build.
- `npm run lint`: Type checking.
