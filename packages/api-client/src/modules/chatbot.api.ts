import { api } from '../api';

/** A product row the assistant surfaced, rendered by the widget as a card. */
export interface ChatProduct {
  name: string;
  price: number | null;
  stock: number;
  url: string;
  image: string | null;
  category?: string;
  avg_rating?: number | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | string;
  content: string;
  thoughts?: string;
  thinkingTimeMs?: number;
  attachments?: { name: string; data: string; type: string }[];
  /** Present on assistant messages whose turn ran a product tool. */
  products?: ChatProduct[];
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  attachments?: { name: string; data: string; type: string }[];
  thinkingEnabled?: boolean;
  thinkingBudget?: number;
}

export interface ChatResponse {
  response: string;
  thoughts?: string;
  thinkingTimeMs?: number;
  products?: ChatProduct[];
}

/**
 * The shared client times out at 30s, which is right for ordinary REST calls and
 * far too short for this one: a thinking-enabled Gemini turn that also runs a
 * product or order lookup regularly passes it. Axios then aborts with no
 * response, so the widget showed "Sorry, I encountered an error processing your
 * request." on exactly the questions worth asking, while the server kept working
 * on a reply nobody would ever see.
 */
const CHAT_TIMEOUT_MS = 120000;

export async function sendChatMessageFull(
  message: string,
  history: ChatMessage[] = [],
  attachments?: { name: string; data: string; type: string }[],
  options?: { thinkingEnabled?: boolean; thinkingBudget?: number; pageContext?: string }
): Promise<ChatResponse> {
  try {
    const { data } = await api.post<ChatResponse>('/chatbot/chat', {
      message,
      // The transcript is replayed as history, but the product cards on
      // assistant messages are display data: the model gets its product
      // facts from tools, and the API's strict DTO validation 400s on
      // fields it does not expect. Strip them at this single choke point
      // so no caller can ship a conversation the API refuses.
      history: history.map(({ products: _products, ...m }) => m),
      attachments,
      thinkingEnabled: options?.thinkingEnabled ?? true,
      thinkingBudget: options?.thinkingBudget ?? 2048,
      // Where the customer is on the site, so "is this good?" on a product
      // page needs no clarifying question. The API clamps the length.
      pageContext: options?.pageContext,
    }, { timeout: CHAT_TIMEOUT_MS });
    return data;
  } catch (err) {
    console.warn('[Chatbot] Failed to send message:', err);
    throw err;
  }
}

export async function sendChatMessage(
  message: string, 
  history: ChatMessage[] = [],
  attachments?: { name: string; data: string; type: string }[],
  options?: { thinkingEnabled?: boolean; thinkingBudget?: number }
): Promise<string> {
  const res = await sendChatMessageFull(message, history, attachments, options);
  return res.response;
}
