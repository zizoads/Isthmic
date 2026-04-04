# Design Document: Sovereign Negotiation State Machine
**Version:** 1.0  
**Status:** Pending Approval  
**Owner:** Chief Architect (Isthmic Pro)

---

## 1. Introduction & Objectives

### The "State Statelessness" Problem
The current negotiation room system lacks "phase awareness." Every message is analyzed as an isolated event, preventing the AI from perceiving the cumulative development of trust or tension. This leads to tactical recommendations that might contradict the actual stage of the deal (e.g., suggesting a deal closure during the initial exploration phase).

### Final Objective
Build a "Stateful System" that links negotiation history with a tactical decision matrix, allowing the platform to:
1. Accurately classify the current phase (Pipeline Visibility).
2. Detect "regression" in intent or "progression" towards a resolution.
3. Customize the tone of the response based on the phase (e.g., a firm tone in the Tension phase, and a facilitative tone in the Closing phase).

---

## 2. Core Definitions

### Deal State List (DealStateEnum)

| State | Practical Definition | Behavioral Signals |
| :--- | :--- | :--- |
| **INITIAL** | First human contact or general inquiry. | General question about price, "Is the domain available?". |
| **DISCOVERY** | The buyer is performing "data verification." | Questions about traffic, reason for selling, SEO history. |
| **TENSION** | Start of actual bargaining and financial expectation clash. | Lowball offers, mentioning domain flaws for leverage. |
| **AGREEMENT** | Reaching verbal consensus on price and core terms. | Use of phrases like "I accept", "Done", "Agreement". |
| **CLOSING** | Moving to logistical details of ownership transfer. | Asking about Escrow, payment method, Auth code. |
| **STALLED** | Deal is in a state of stagnation or long silence from one party. | Absence of response for more than 48 hours, brief and non-binding answers. |

### Deal State Object (DealState Interface)
```typescript
interface DealState {
  currentState: DealStateEnum;
  confidenceScore: number;    // Model's certainty in the phase (0.0 - 1.0)
  previousState?: DealStateEnum;
  transitionReason: string;   // Logical explanation for the transition
  lastUpdate: string;         // ISO Timestamp
}
```

---

## 3. State System Design

### Transition Logic
The system will rely on a **hybrid** of Structured Rules and LLM Inference:

1. **Layer 1 (LLM Parser):** Gemini analyzes the message and matches it with the deal state criteria defined in the system.
2. **Layer 2 (State Filter):** Illogical transitions are prevented (e.g., from INITIAL directly to CLOSING without passing through DISCOVERY or TENSION) except in exceptional cases (Buy It Now).

### State Flowchart
`INITIAL -> DISCOVERY -> TENSION -> AGREEMENT -> CLOSING`  
*(Note: Any state can transition to STALLED or LOST at any time).*

---

## 4. APIs & Integration

### Function Signature
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

### Side Effects
- The function is **Stateless** (pure): It does not update the database directly.
- The `NegotiationService` receives the result and updates the `NegotiationThread` in the Sovereign Vault to ensure state tracking across sessions.

---

## 5. Migration Plan

1. **Update `types.ts`:** Add the new Enum and Interface (included in this update).
2. **Update `NegotiationService.ts`:** Inject the new inference logic within the `auditMessageDeep` function.
3. **Update UI:** Add a "Deal Roadmap" bar at the top of the `NegotiationDashboard`.

---

## 6. Risks & Mitigation

- **Bias:** To avoid "False Closing" optimism, the Temperature in Gemini will be set to 0.1 when analyzing the state to ensure precision and balance.
- **Complexity:** The state will be kept within the original `NegotiationThread` object to avoid building complex new tables in the database.

---
*End of Document - Awaiting Sovereign Approval.*
