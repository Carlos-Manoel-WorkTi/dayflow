// src/api/gemini.ts

import { SystemInstruction, GeminiResponse } from "@/types";


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Envia prompt para o Gemini e retorna a resposta
 */
export async function getInsights(instruction: SystemInstruction): Promise<GeminiResponse> {
  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `[Sistema: ${instruction.system}]\n${instruction.prompt}` }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.[0]?.text || "";

    return { text, raw: data };
  } catch (err) {
    console.error("Erro ao chamar Gemini API:", err);
    return { text: "", raw: err };
  }
}
