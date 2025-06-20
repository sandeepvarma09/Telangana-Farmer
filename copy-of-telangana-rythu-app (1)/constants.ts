// This file is intentionally simple for now.
// Translations are handled in translations.ts and used via useLanguage hook.
// Icons are separate components in components/icons/.
// Mock data is in services/mockData.ts.

export const APP_TITLE = "Telangana Rythu App";
export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

export const CHATBOT_NAME = "Rythu Mitra AI";
export const CHATBOT_INITIAL_MESSAGE_KEY = "chatbotInitialMessage";
export const CHATBOT_SUGGESTED_QUESTION_1_KEY = "chatbotSuggestedQuestion1";
export const CHATBOT_SUGGESTED_QUESTION_2_KEY = "chatbotSuggestedQuestion2";
export const CHATBOT_SUGGESTED_QUESTION_3_KEY = "chatbotSuggestedQuestion3";

// System prompt for Gemini
export const GEMINI_SYSTEM_PROMPT = `You are 'Rythu Mitra', a helpful AI assistant for farmers in Telangana, India.
You can communicate in English, Telugu, or Hindi.
Respond in the language the user uses. If the user asks in Telugu, respond in Telugu. If in Hindi, respond in Hindi. If in English, respond in English.
Your knowledge base includes Kharif and Rabi crop cycles, local soil types, pest management for common crops like cotton and paddy, and Telangana government schemes like Rythu Bandhu.
Your goal is to provide clear, actionable, and encouraging advice. Prioritize advice relevant to small and medium-scale farmers in Telangana.
If you use information from Google Search grounding, you MUST cite the source URLs provided in the grounding chunks. Format citations like [Source: URL].`;

export const API_REQUEST_TIMEOUT_MS = 10000; // 10 seconds for API requests
export const MAX_CHAT_HISTORY = 10; // Max previous messages to send to Gemini for context

// Placeholder for API key retrieval logic. In a real app, this would be more secure.
// As per instructions, this MUST be process.env.API_KEY.
// For browser environment, this will be undefined unless set via build tools.
// The instructions say "Assume this variable is pre-configured".
export const API_KEY = process.env.API_KEY;

export const DEBOUNCE_DELAY = 300; // milliseconds

export const DEFAULT_LANGUAGE = 'telugu';

export const MANDI_RATE_CATEGORIES = {
  all: 'all',
  grains: 'grains',
  vegetables: 'vegetables',
  pulses: 'pulses',
};

export const CROP_SEASONS_TABS = {
  kharif: 'kharif',
  rabi: 'rabi',
};

export const PLACEHOLDER_IMAGE_URL_CROPS = (width: number, height: number, seed: string) => `https://picsum.photos/seed/${seed}/${width}/${height}`;
export const PLACEHOLDER_IMAGE_URL_ISSUES = (width: number, height: number, seed: string) => `https://picsum.photos/seed/${seed}_issue/${width}/${height}`;


// Reports Section Constants (Formerly Lovable)
export const REPORTS_PAGE_PATH = "/reports"; // Changed from LOVABLE_PAGE_PATH and "/lovable"

export const ISSUE_CATEGORIES = {
  roads: 'roads',
  drainage: 'drainage',
  waterSupply: 'waterSupply',
  powerOutage: 'powerOutage',
  garbage: 'garbage',
  electricalInfrastructure: 'electricalInfrastructure',
  other: 'other',
};

export const ISSUE_STATUSES = {
  open: 'open',
  inProgress: 'inProgress',
  resolved: 'resolved',
  rejected: 'rejected',
};