# Refactor Plan - Isthmic Pro

## Step 1: Component Decentralization
- **GitHub Path**: `components/` -> `components/dashboards/`
- **Rationale**: Currently, root `components/` is cluttered with 16+ dashboards. Moving them to a subfolder separates layout-level views from atom-level components.
- **Verification**: Check if `App.tsx` imports reflect `from './components/dashboards/...'`.

## Step 2: Custom Hook Extraction
- **GitHub Path**: `App.tsx` logic -> `hooks/useMasterBrain.ts`
- **Before Snapshot**: `handleInitiateGlobalScan` inside `App.tsx`.
- **After Snapshot**: `const { initiateScan } = useMasterBrain(strategy);` inside `App.tsx`.
- **Rationale**: Isolates AI orchestration logic from UI rendering, making the "Master Brain" testable in isolation.

## Step 3: Domain Context Provider
- **GitHub Path**: `App.tsx` state -> `context/DomainContext.tsx`
- **Rationale**: Currently, `domains` and `setDomains` are passed as props to 10+ components (Prop-Drilling). Context API provides a singleton state accessible by any agent.
- **Verification**: Remove `domains` prop from `PipelineDashboard` and use `useContext(DomainContext)`.

## Step 4: UI Primitives Standardization
- **Create**: `components/ui/StatusBadge.tsx`
- **Rationale**: `App.tsx` and `PipelineDashboard` use inline Tailwind for badges. Creating a primitive ensures consistent colors for 'purchased', 'available', and 'negotiating'.
