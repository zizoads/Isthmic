# Refactor Plan - Isthmic Pro

## 1. Directory Reorganization
- **Move**: All component dashboards from `components/*.tsx` to `components/dashboards/`.
- **Reason**: Separates primary agent views from reusable UI primitives.
- **Action**: Create `components/dashboards` and move `DiscoveryDashboard.tsx`, `EvaluationDashboard.tsx`, etc.

## 2. Business Logic Isolation
- **Move**: Logic within `App.tsx` (like `handleInitiateGlobalScan`) to a dedicated hook `hooks/useMasterBrain.ts`.
- **Reason**: Prevents `App.tsx` from becoming a "God Component" (anti-pattern).

## 3. UI Unified Primitives
- **Create**: `components/ui/` folder for `GlassCard.tsx`, `ActionButton.tsx`, and `StatusBadge.tsx`.
- **Reason**: Ensures visual consistency and reduces CSS duplication.

## 4. State Management Refactor
- **Change**: Replace prop-drilling with a `DomainContext` in `App.tsx`.
- **Reason**: Allows any nested agent (like `Messaging`) to update a domain's status without passing functions through 3 layers.
