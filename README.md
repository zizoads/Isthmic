# Isthmic Pro: Domainer Enterprise Suite

## 1. Project Title
Isthmic Pro: Sovereign Domain Investment Command Center.

## 2. Short Description
An elite, industrial-grade domain management platform that leverages multi-agent AI (Gemini 3) for the discovery, forensic valuation, and strategic liquidation of digital assets.

## 3. Functional Description
1. **Strategic Discovery**: Scans global markets based on "Commander's Intent".
2. **Forensic Audit**: Verifies trademarks and market comps using Google Search grounding.
3. **Brand Synthesis**: Automatically generates logos and taglines for acquired assets.
4. **Liquidation Engine**: Optimizes Afternic listings and generates corporate outreach pitches.

## 4. Architecture Diagram
```ascii
[ User Intent ] -> [ Master Brain ]
                      |
      ---------------------------------
      |               |               |
[ Discovery ]   [ Evaluation ]   [ Portfolio ]
      |               |               |
[ Pipeline  ] <--- [ Audit ] <--- [ Branding ]
      |
[ Liquidation (Marketplace / Messaging) ]
```

## 5. Dependency Tree
- **Core**: React 19, TypeScript.
- **AI**: @google/genai (Gemini 3 & 2.5 Flash).
- **Styling**: Tailwind CSS.
- **Charts**: Recharts.
- **Icons**: FontAwesome 6.

## 6. Installation & Local Run
1. Clone the repository.
2. Run `npm install`.
3. Ensure `process.env.API_KEY` is set in your environment.
4. Run `npm run dev`.

## 7. Environment Variables & Defaults
- `API_KEY`: Required. Your Google AI Studio Key.
- `APP_LANG`: Default `ar`. Supported: `ar`, `en`.

## 8. Deployment (Vercel) Steps
1. Connect GitHub repository to Vercel.
2. Add `API_KEY` to "Environment Variables" in project settings.
3. Deploy.

## 9. Known Gaps
- Feedback loop does not yet modify agent weights dynamically (See `analysis.md`).
- Missing native mobile app (PWA only).

## 10. Testing/Validation Instructions
- Run `npm test` to execute use-case simulations.
- Manual check: Open Command Palette (`Ctrl+K`) to verify navigation hooks.

## 11. CLI Commands List
- `npm run dev`: Start local development server.
- `npm run build`: Build production bundle.
- `npm run lint`: Run Type Checking and Linting.
