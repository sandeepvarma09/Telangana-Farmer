import { GoogleGenAI, GenerateContentResponse, Content, Part, GroundingChunk } from "@google/genai";
import { API_KEY, GEMINI_MODEL_TEXT, GEMINI_SYSTEM_PROMPT } from '../constants';
import { ChatMessage as AppChatMessage, Language } from '../types'; // App's ChatMessage type & Language

// Define GeminiChatMessage using Content
type GeminiChatMessage = Content;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!API_KEY) {
      console.error("API_KEY is not set. Please ensure the environment variable is configured.");
    }
    this.ai = new GoogleGenAI({ apiKey: API_KEY! });
  }

  private formatAppMessagesToGeminiHistory(messages: AppChatMessage[]): GeminiChatMessage[] {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));
  }

  async generateContent(
    prompt: string,
    history: AppChatMessage[] = [],
    currentLanguage?: Language // Optional current language
  ): Promise<{ text: string; groundingChunks?: GroundingChunk[] }> {
    if (!API_KEY) {
      return { text: "API Key not configured. Please contact support." };
    }

    const geminiHistory: Content[] = this.formatAppMessagesToGeminiHistory(history);
    const currentPromptContent: Content = { role: 'user', parts: [{ text: prompt }] };
    const requestContents: Content[] = [...geminiHistory, currentPromptContent];

    let systemInstruction = GEMINI_SYSTEM_PROMPT;
    if (currentLanguage) {
      let langInstruction = "";
      if (currentLanguage === Language.Telugu) langInstruction = "You MUST respond in Telugu unless the user explicitly switches or asks in another language. ప్రయోగశీలి తెలుగులో మాట్లాడితే, మీరు తెలుగులో జవాబు ఇవ్వాలి.";
      else if (currentLanguage === Language.Hindi) langInstruction = "You MUST respond in Hindi unless the user explicitly switches or asks in another language. यदि उपयोगकर्ता हिंदी में पूछता है, तो आपको हिंदी में जवाब देना होगा।";
      else if (currentLanguage === Language.English) langInstruction = "You MUST respond in English unless the user explicitly switches or asks in another language.";
      
      // Prepend to existing system prompt or structure as needed.
      // For now, appending. Consider if it overrides or complements.
      // systemInstruction = `${langInstruction}\n${GEMINI_SYSTEM_PROMPT}`;
      // Let's refine the main prompt in constants.ts to be more direct about language based on user input.
      // The passed currentLanguage can be a hint if the main prompt isn't sufficient.
      // For now, the main prompt already asks to respond in user's language.
      // We can add a more specific hint if needed here.
    }


    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: requestContents,
        config: {
          systemInstruction: systemInstruction, // Using the potentially modified systemInstruction
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = response.text;
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const groundingChunks = groundingMetadata?.groundingChunks;

      return { text: responseText, groundingChunks };

    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      let errorMessage = "Failed to get response from AI.";
      if (error.message) {
        errorMessage += ` Details: ${error.message}`;
      }
      if (error.toString().includes('API key not valid')) {
        errorMessage = "API Key is not valid. Please check your configuration.";
      }
      return { text: errorMessage };
    }
  }

  private parseJsonResponse<T>(responseText: string): T | null {
    let jsonStr = responseText.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    try {
      return JSON.parse(jsonStr) as T;
    } catch (e) {
      console.error("Failed to parse JSON response:", e, "Original text:", responseText);
      return null;
    }
  }
}