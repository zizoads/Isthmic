
import { GoogleGenAI } from "@google/genai";

export const getAIClient = () => {
  // Always fetch the freshest key to avoid race conditions from the dialog
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_NOT_FOUND: Please select a valid key via the Command Center.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function safeAICall<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error.message || "";
    const isQuotaError = errorMsg.includes('429') || error.status === 429;
    const isNotFoundError = errorMsg.includes('Requested entity was not found');

    if (isNotFoundError) {
      // Force user to re-select key as per guidelines
      if (window.aistudio) {
        window.aistudio.openSelectKey();
      }
      throw new Error("API_KEY_INVALID: Project/Key not found. Re-selection triggered.");
    }

    if (retries > 0 && isQuotaError) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return safeAICall(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}
