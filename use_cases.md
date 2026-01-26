# Use Cases - Functional Verification

## UC-1: Strategic Global Sweep
- **Actor**: Domain Architect (User)
- **Goal**: Discover 5+ high-potential domains based on a specific investment thesis.
- **Verification**: 
  - User enters "Short 3-letter AI domains" in Master Brain.
  - System calls `rigorousDiscoveryAI`.
  - System injects results into `domains` state.
  - UI reflects new count in `Discovery` tab.

## UC-2: Forensic Asset Audit
- **Actor**: Evaluation Agent (AI)
- **Goal**: Verify if `quantum-ledger.com` has trademark risks or high authority.
- **Verification**:
  - User triggers "Audit" in Evaluation Dashboard.
  - System performs Grounded Search.
  - System populates `technicalMetrics` with DA and Trademark risk strings.
  - Agent Reasoning Lab displays the "Chain of Thought".

## UC-3: Visual Brand Synthesis
- **Actor**: Creative Agent (AI)
- **Goal**: Generate a logo and tagline for a purchased asset.
- **Verification**:
  - User clicks "Generate Brand DNA" in Portfolio Manager.
  - System returns a base64 logo and string tagline.
  - Portfolio view updates to show the generated visual identity.
