# QA Checklist

## 1. Compliance
- [ ] Every change references `analysis.md`.
- [ ] No "orphan code" exists.

## 2. Performance
- [ ] Command Palette (`Ctrl+K`) response < 100ms.
- [ ] Global search grounding results < 5s.

## 3. Aesthetics
- [ ] Dark mode first consistency.
- [ ] Arabic/English RTL/LTR support perfect.

## 4. Deployment
- [ ] Vercel build passes with current `vite.config.ts`.
- [ ] `process.env.API_KEY` is not exposed in client logs.
