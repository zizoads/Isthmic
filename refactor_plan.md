# Refactor Plan - Isthmic Enterprise

## 1. Directory Reorganization
- **Objective**: Separate UI from business logic and types.
- **Action**:
  - Move all dashboards to `components/dashboards/`.
  - Move UI primitives (Button, Modal, Card) to `components/ui/`.
  - Move services to `lib/` or `services/`.

## 2. Global State Management
- **Objective**: Centralize domain updates to prevent stale data.
- **Action**: Implement a `useDomainManager` hook in `App.tsx` that provides unified `updateDomain`, `addDomain`, and `deleteDomain` functions to all children.

## 3. AI Safety & Error Handling
- **Objective**: Prevent UI crashes on AI failure.
- **Action**: Wrap `geminiService` calls in a unified `executeAgentTask` wrapper that handles logging, retries, and notification dispatching.

## 4. Branding & Aesthetics
- **Objective**: Ensure high-end enterprise look and feel.
- **Action**: Update `index.html` with a more aggressive "Dark Mode First" CSS strategy using refined shadows and blur effects.
