# وثيقة تصميم: آلية الحالة التفاوضية السيادية (Negotiation State Machine)
**الإصدار:** 1.0  
**الحالة:** بانتظار الاعتماد  
**المالك:** Chief Architect (Isthmic Pro)

---

## 1. المقدمة والهدف (Introduction & Objectives)

### مشكلة "فقدان الحالة" (State Statelessness)
يفتقر نظام الغرفة التفاوضية الحالي إلى "الوعي المرحلي". كل رسالة يتم تحليلها كحدث معزول، مما يمنع الذكاء الاصطناعي من إدراك التطور التراكمي للثقة أو التوتر. هذا يؤدي إلى توصيات تكتيكية قد تكون متناقضة مع المرحلة الفعلية للصفقة (مثلاً: اقتراح إغلاق الصفقة في مرحلة الاستكشاف الأولية).

### الهدف النهائي
بناء "نظام حالة" (Stateful System) يربط التاريخ التفاوضي بمصفوفة قرارات تكتيكية، مما يسمح للمنصة بـ:
1. تصنيف المرحلة الحالية بدقة (Pipeline Visibility).
2. اكتشاف "التراجع" في النوايا أو "التقدم" نحو الحسم.
3. تخصيص نبرة الرد (Tone) بناءً على المرحلة (مثل: نبرة حازمة في مرحلة Tension، ونبرة تسهيلية في مرحلة Closing).

---

## 2. التعاريف والمفاهيم الأساسية (Core Definitions)

### قائمة حالات الصفقة (DealStateEnum)

| الحالة | التعريف العملي | العلامات السلوكية |
| :--- | :--- | :--- |
| **INITIAL** | أول تواصل بشري أو استفسار عام. | سؤال عام عن السعر، "هل النطاق متاح؟". |
| **DISCOVERY** | المشتري يقوم بإجراء "التحقق من البيانات". | أسئلة عن الترافيك، سبب البيع، التاريخ السيو. |
| **TENSION** | بدء عملية المساومة الفعلية وتصادم التوقعات المالية. | تقديم عروض منخفضة (Lowball)، ذكر عيوب في النطاق للضغط. |
| **AGREEMENT** | الوصول إلى توافق شفهي على السعر والشروط الأساسية. | استخدام عبارات مثل "I accept", "Done", "Agreement". |
| **CLOSING** | الانتقال إلى التفاصيل اللوجستية لنقل الملكية. | السؤال عن Escrow، طريقة الدفع، كود الـ Auth. |
| **STALLED** | الصفقة في حالة جمود أو صمت طويل من أحد الطرفين. | غياب الرد لأكثر من 48 ساعة، إجابات مقتضبة وغير ملزمة. |

### كائن حالة الصفقة (DealState Interface)
```typescript
interface DealState {
  currentState: DealStateEnum;
  confidenceScore: number;    // مدى يقين النموذج في المرحلة (0.0 - 1.0)
  previousState?: DealStateEnum;
  transitionReason: string;   // شرح منطقي لسبب الانتقال
  lastUpdate: string;         // ISO Timestamp
}
```

---

## 3. تصميم نظام الحالة (State System Design)

### منطق الانتقال (Transition Logic)
سيعتمد النظام على **هجين** بين القواعد الهيكلية (Structured Rules) والاستنتاج اللغوي (LLM Inference):

1. **الطبقة الأولى (LLM Parser):** يقوم Gemini بتحليل الرسالة ومطابقتها مع معايير حالات الصفقة المحددة في النظام.
2. **الطبقة الثانية (State Filter):** يتم منع الانتقالات غير المنطقية (مثلاً: من INITIAL مباشرة إلى CLOSING دون مرور بـ DISCOVERY أو TENSION) إلا في حالات استثنائية (Buy It Now).

### مخطط التدفق (State Flowchart)
`INITIAL -> DISCOVERY -> TENSION -> AGREEMENT -> CLOSING`  
*(ملاحظة: يمكن لأي حالة أن تنتقل إلى STALLED أو LOST في أي وقت).*

---

## 4. واجهات البرمجة والتكامل (APIs & Integration)

### توقيع الوظيفة (Function Signature)
```typescript
static async inferStateTransition(
  currentMessage: string, 
  messageHistory: NegotiationMessage[], 
  currentDealState?: DealState
): Promise<{ 
  newState: DealState; 
  analysis: string; 
  suggestedAction: string 
}>;
```

### التأثيرات الجانبية (Side Effects)
- الوظيفة **Stateless** (نقية): لا تقوم بتحديث قاعدة البيانات مباشرة.
- يقوم `NegotiationService` باستلام النتيجة وتحديث `NegotiationThread` في Supabase لضمان تتبع الحالة عبر الجلسات.

---

## 5. خطة الترحيل والاعتبارات (Migration Plan)

1. **تحديث ملف `types.ts`:** إضافة Enum و Interface الجديد (تم تضمينه في هذا التحديث).
2. **تحديث `NegotiationService.ts`:** حقن منطق الاستنتاج الجديد ضمن دالة `auditMessageDeep`.
3. **تحديث واجهة المستخدم:** إضافة شريط "Deal Roadmap" في أعلى `NegotiationDashboard`.

---

## 6. المخاطر والتخفيف (Risks & Mitigation)

- **Bias (التحيز):** لتجنب "التفاؤل الزائف" (False Closing)، سيتم ضبط درجة الحرارة (Temperature) في Gemini إلى 0.1 عند تحليل الحالة لضمان الدقة والاتزان.
- **Complexity (التعقيد):** سيتم الاحتفاظ بالحالة ضمن كائن `NegotiationThread` الأصلي لتجنب بناء جداول معقدة جديدة في قاعدة البيانات.

---
*نهاية الوثيقة - بانتظار الاعتماد السيادي.*