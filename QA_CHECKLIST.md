# QA Checklist - Enterprise Ready

## 1. Code Standards
- [ ] No `any` types used except for raw AI JSON parsing.
- [ ] All components use `React.FC` with explicit `Props` interface.
- [ ] File naming follows `PascalCase` for components.

## 2. Performance
- [ ] Dashboard switching < 100ms.
- [ ] LocalStorage payload < 2MB.
- [ ] Image base64 strings cleared if domain is deleted.

## 3. Security
- [ ] `process.env.API_KEY` is never logged to `console`.
- [ ] All external URLs in `AgentReasoningLab` use `rel="noreferrer"`.

## 4. Accessibility
- [ ] Arabic RTL layout tested on mobile (iPhone 14/15 viewport).
- [ ] Dark mode contrast ratios meet WCAG AA standards.
