# 🚀 Isthmic: Domainer Pro Platform
## *The Industrial-Grade Multi-Agent Command Center for Domain Investing*

**Isthmic (Domainer Pro)** is an advanced AI-driven platform designed for professional domain investors. It leverages a multi-agent architecture powered by **Gemini 3 Pro** to automate the discovery, evaluation, branding, and liquidation of high-value .com assets.

---

## 🏗️ Technical Architecture

The project follows a **Modular Agentic Design**:
- **Inference Layer:** Uses `@google/genai` (Gemini 3) for deep market reasoning and image generation.
- **Frontend Layer:** React 19 + TypeScript for a type-safe, high-performance UI.
- **Styling:** Tailwind CSS with a custom "OpenAI-style" Aurora glassmorphism theme.
- **State Management:** Centralized React state with `localStorage` persistence for "Chain of Thought" (CoT) persistence.

### Folder Structure
- `/components`: Specialized agent dashboards (Discovery, Evaluation, Nexus Prime, etc.).
- `/services`: The "Neural Core" managing all AI inference calls.
- `/types.ts`: Strict domain models ensuring system-wide data integrity.
- `/translations.ts`: Bi-directional (AR/EN) support for global operations.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js:** v18.0 or higher.
- **API Key:** A valid Google Gemini API Key.

### Local Development
1. **Clone the repository:**
   ```bash
   git clone https://github.com/zizoads/Isthmic.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Variables:**
   Create a `.env` file and add your key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```
4. **Run the application:**
   ```bash
   npm run dev
   ```

---

## 🚀 Deployment (Vercel)

1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. In the environment variables section, add `API_KEY`.
3. Vercel will automatically detect the Vite/React configuration and deploy.

---

## 🤖 Agents Inventory

1. **Strategic Sniper (Discovery):** Scans markets for undervalued assets.
2. **Forensic Appraiser (Evaluation):** Deep-dives into SEO, history, and trademark risks.
3. **Nexus Prime:** High-level trend forecasting and DNA brand generation.
4. **Tactical Negotiator:** Analyzes buyer psychology and generates battle-tested scripts.
5. **Executive Reporter:** Synthesizes portfolio performance into printable memorandums.

---

## ⚖️ License & Disclaimer
This project is for professional investment support. Users are responsible for final financial decisions. Built with high-fidelity engineering standards.
