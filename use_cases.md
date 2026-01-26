# Use Case Inventory

## UC-1: AI-Driven Discovery
- **Actor**: User (Portfolio Manager).
- **Goal**: Find 5+ high-value domains for a specific niche.
- **Verification**: `rigorousDiscoveryAI` must return valid JSON.
- **Automation Test**: Check if `domains` state length increases after `handleSearch` execution.

## UC-2: Forensic Audit Protocol
- **Actor**: Evaluation Agent.
- **Goal**: Identify trademark risks for a new discovery.
- **Verification**: `technicalMetrics.trademarkRisk` should contain grounded search citations.
- **Automation Test**: Verify `domain.technicalMetrics` is not null after audit button click.

## UC-3: Multi-Stage Liquidation
- **Actor**: Liquidation Agent.
- **Goal**: Generate a corporate pitch for a purchased domain.
- **Verification**: `MessagingDashboard` displays a pitch including company-specific synergy.
- **Automation Test**: `messages` array in `MessagingDashboard` should contain a new item after "Generate Pitch".
