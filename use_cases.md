# Use Case Inventory

## UC-1: The Sovereign Sweep
- **Description**: Finding 5 high-potential domains based on a niche prompt.
- **Verification**: `rigorousDiscoveryAI` must return a valid JSON array.
- **Test**: `DiscoveryDashboard.test.tsx` (Simulated).

## UC-2: Forensic Audit Protocol
- **Description**: Verifying trademark safety for a specific domain.
- **Verification**: `checkTrademarkRiskAI` must return grounded search results.
- **Test**: `EvaluationDashboard.test.tsx`.

## UC-3: Brand DNA Synthesis
- **Description**: Generating a logo and color palette for a purchased domain.
- **Verification**: `generateBrandIdentityAI` must return a base64 image and hex color.
- **Test**: Visual validation in `PortfolioManager`.
