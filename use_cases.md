# Use Case Inventory

## UC-1: Strategic Discovery Scan
- **ID**: UC-DISC-01
- **Trigger**: User enters prompt in `DiscoveryDashboard.tsx`.
- **Input (JSON)**: `{ "prompt": "Short .com domains in AI sector", "lang": "ar" }`
- **Expected Output (JSON)**: `[{ "name": "ai-vision.com", "estimatedPrice": 1200, "justification": "High search volume", "probability": 0.85 }]`
- **Acceptance Criteria**: `domains` array in `App.tsx` state increases by the number of returned items.

## UC-2: Forensic Trademark Audit
- **ID**: UC-AUDIT-01
- **Trigger**: User clicks "Audit Action" in `EvaluationDashboard.tsx`.
- **Preconditions**: Domain exists in `available` state.
- **Verification**: `technicalMetrics.trademarkRisk` is populated via `checkTrademarkRiskAI`.

## UC-3: Brand DNA Synthesis
- **ID**: UC-BRAND-01
- **Trigger**: User clicks "Generate Brand DNA" in `PortfolioManager.tsx`.
- **Input**: Domain ID.
- **Output**: Base64 image URL injected into `domain.brandAssets.logoUrl`.
