
# QA Production Checklist

## 1. Technical Integrity
- [ ] **Type Safety**: No `any` used in `geminiService.ts` or `App.tsx`.
- [ ] **API Security**: `process.env.API_KEY` is not exposed in source maps or logs.
- [ ] **State Persistence**: `localStorage` handles schema versioning (no crashes on older data).
- [ ] **Error Handling**: `DiscoveryDashboard` handles `AbortController` signal correctly when user cancels mission.

## 2. Performance Benchmarks
- [ ] **Initial Load**: Dashboard interactive within < 1.5s.
- [ ] **AI Latency**: Discovery results returned within < 15s (Google Search Grounding threshold).
- [ ] **Image Generation**: Logo synthesized within < 10s.
- [ ] **Smooth Scroll**: Pipeline scroll snapping works on mobile devices.

## 3. UI/UX & Aesthetics
- [ ] **RTL Compliance**: All text aligned correctly in Arabic mode (check `App.tsx` dir prop).
- [ ] **Dark Mode**: Contrast ratios meet WCAG AA standards (checked via index.html styling).
- [ ] **Command Palette**: `Ctrl+K` triggers correctly and searches all 16 agents.
- [ ] **Responsive**: Sidebar collapses correctly on screens < 1024px.

## 4. AI Verification
- [ ] **Groundedness**: All `googleSearch` responses show citation links in `AgentReasoningLab`.
- [ ] **JSON Validity**: `geminiService.ts` correctly parses all `responseSchema` responses.
- [ ] **Multi-Modality**: `gemini-2.5-flash-image` output displayed as valid Base64 string.
