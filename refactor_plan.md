# Refactor Plan - Isthmic Pro

## 1. Directory Reorganization
- **Move**: `components/*.tsx` to `components/dashboards/` for primary agents.
- **Create**: `components/ui/` for primitive elements (Buttons, GlassCard, StatusBadge).
- **Logic**: Isolating UI presentation from the heavy AI processing logic found in `geminiService.ts`.

## 2. Global State Management
- **Issue**: State is currently centralized in `App.tsx` but passed through deep prop drilling.
- **Fix**: Implement `DomainContext` to provide unified `updateDomain` and `injectActivity` functions.

## 3. Naming Conventions
- **Standard**: All dashboards must use the suffix `Dashboard.tsx`.
- **Standard**: All AI service functions must use the suffix `AI`.

## 4. Code Removal
- Remove unused simulated data generators in `App.tsx` and rely solely on `geminiService.ts` for data population.
