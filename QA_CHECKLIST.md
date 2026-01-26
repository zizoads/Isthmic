# QA Checklist - Enterprise Standards

## 1. Code Standards
- [ ] No `any` types in `types.ts` or `services/geminiService.ts`.
- [ ] All components use `React.FC` with explicit interfaces (Ref: `App.tsx:32`).
- [ ] 100% RTL/LTR compliance checked via `document.documentElement.dir`.

## 2. Performance
- [ ] `DiscoveryDashboard` search results render within 500ms of API response.
- [ ] `App.tsx` bundle size < 500KB (Gzipped).
- [ ] Dashboard switching delay < 50ms.

## 3. Security
- [ ] `process.env.API_KEY` not visible in Chrome DevTools Network Tab as cleartext.
- [ ] `localStorage` sanitized before parsing to prevent XSS.
- [ ] All external links in `PurchaseDashboard.tsx` use `target="_blank" rel="noopener noreferrer"`.

## 4. UI/UX
- [ ] Dark mode contrast ratios meet WCAG AA (checked in `index.html`).
- [ ] Mobile sidebar (Ref: `App.tsx:137`) is swipable.
