# QA Checklist - Enterprise Standards

## 1. Performance
- [ ] Initial load < 2.0s.
- [ ] AI response parsing < 500ms (post-API).
- [ ] LocalStorage usage < 4MB (compression for images).

## 2. Aesthetics & UX
- [ ] Consistent "Glassmorphism" across all tabs.
- [ ] Sidebar state persists on page refresh.
- [ ] ARIA labels present on all interactive elements.
- [ ] RTU (Right To Left) layout perfect for Arabic, LTR for English.

## 3. Reliability
- [ ] No "undefined" errors in `PortfolioManager` when brand assets are missing.
- [ ] All `geminiService` functions have fallback return values.
- [ ] Command Palette (Ctrl+K) works in all views.

## 4. Security
- [ ] API Key never logged to console.
- [ ] No external assets loaded except for trusted CDNs (Tailwind, FontAwesome).
