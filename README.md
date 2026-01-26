# 🚀 Isthmic: Domainer Pro Platform

**Isthmic** هو مركز قيادة صناعي متطور لاستثمارات النطاقات، مدعوم بنظام وكلاء ذكاء اصطناعي متعدد (Multi-Agent) لتمتة دورة حياة الاستثمار الرقمي بالكامل.

## 📋 1. Product Definition
- **الهدف:** تحويل عملية البحث اليدوي عن النطاقات إلى عملية أوتوماتيكية تعتمد على البيانات والاستدلال المنطقي.
- **المستخدم المستهدف:** المستثمرون المحترفون الذين يديرون محافظ نطاقات تتجاوز 100 أصل.

## 🛠️ 2. Functional Scope
- **Discovery Agent:** مسح الأسواق وتوليد فرص بناءً على رؤى استراتيجية.
- **Forensic Appraiser:** تدقيق جنائي للنطاقات (SEO، التاريخ، مخاطر العلامات التجارية).
- **Nexus Prime:** محرك توقع الاتجاهات وتوليد الهوية البصرية.
- **Executive Reporting:** تحويل حالة المحفظة إلى مذكرات استثمارية قابلة للطباعة.

## 🏗️ 3. System Architecture
- **Core:** React 19 + TypeScript.
- **AI Engine:** Google GenAI (Gemini 3 Pro/Flash).
- **Styling:** Tailwind CSS + Aurora Glassmorphism.
- **Persistence:** LocalStorage Ledger System.

## 📂 4. Folder & File Responsibilities
- `/services`: المحرك العصبي (اتصالات الـ AI).
- `/components`: واجهات الوكلاء المتخصصة.
- `/types.ts`: تعريفات البيانات الصارمة لضمان Type Safety.
- `App.tsx`: مدير الحالة المركزي ومنظم الملاحة.

## 🔄 5. Data Flow
1. **Input:** يقوم المستخدم بإدخال إستراتيجية أو كلمة مفتاحية.
2. **Inference:** يقوم Gemini بتحليل فجوات السوق.
3. **Ledger:** يتم تخزين النتائج في المستودع المحلي.
4. **Action:** يتم نقل النطاقات عبر "خط الإنتاج" (Pipeline) من الاستكشاف إلى الشراء.

## ⚙️ 6. Local Development Setup
```bash
npm install
npm run dev
```

## 🌐 7. Deployment (Vercel)
المشروع مهيأ للنشر الفوري على Vercel مع ضبط `API_KEY` في متغيرات البيئة.

## ⚠️ 8. Known Limitations
- تخزين البيانات محلي (متصفح واحد).
- يعتمد الأداء على سرعة استجابة API محرك Gemini.
