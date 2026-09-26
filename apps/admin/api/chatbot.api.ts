import { apiClient } from "@/lib/apiClient";

// Client for the merged rules-based training backend (api#68 + api#72):
// distilled trigger→instruction rules stored in Postgres, pulled by the
// Gemini sidecar on every chat. Tier/order/delete-all/reorder need api#72.

export type ChatbotRuleTier = "CORE" | "SURFACE";

export interface ChatbotRuleHistoryMessage {
  role: string;
  content?: string;
}

export interface ChatbotRule {
  id: string;
  trigger: string;
  instruction: string;
  isActive: boolean;
  tier: ChatbotRuleTier;
  order: number;
  /** The sandbox conversation this rule was distilled from (api#73+);
   * null/undefined on rules saved before that shipped. */
  history?: ChatbotRuleHistoryMessage[] | null;
  createdAt: string;
  updatedAt: string;
}

export async function listChatbotRules(): Promise<ChatbotRule[]> {
  const { data } = await apiClient.get<{ data: ChatbotRule[] }>("/admin/chatbot/rules");
  return data.data;
}

export async function createChatbotRule(payload: {
  trigger: string;
  instruction: string;
  tier?: ChatbotRuleTier;
  history?: ChatbotRuleHistoryMessage[];
}): Promise<ChatbotRule> {
  const { data } = await apiClient.post<{ data: ChatbotRule }>("/admin/chatbot/rules", payload);
  return data.data;
}

export async function updateChatbotRule(
  id: string,
  payload: Partial<{
    trigger: string;
    instruction: string;
    isActive: boolean;
    tier: ChatbotRuleTier;
    order: number;
    history: ChatbotRuleHistoryMessage[];
  }>,
): Promise<ChatbotRule> {
  const { data } = await apiClient.patch<{ data: ChatbotRule }>(`/admin/chatbot/rules/${id}`, payload);
  return data.data;
}

export async function deleteChatbotRule(id: string): Promise<void> {
  await apiClient.delete(`/admin/chatbot/rules/${id}`);
}

export async function deleteAllChatbotRules(): Promise<void> {
  await apiClient.delete("/admin/chatbot/rules");
}

export async function reorderChatbotRules(
  tier: ChatbotRuleTier,
  orderedIds: string[],
): Promise<ChatbotRule[]> {
  const { data } = await apiClient.patch<{ data: ChatbotRule[] }>("/admin/chatbot/rules/reorder", {
    tier,
    orderedIds,
  });
  return data.data;
}

// ─── Studio: everything about how the assistant behaves ──────────────────

export interface ChatbotConfig {
  assistantName: string;
  greeting: string;
  tagline: string;
  /** 0-100 dials. The API compiles these into instructions; see the preview. */
  formality: number;
  warmth: number;
  detail: number;
  emoji: number;
  salesiness: number;
  languages: string[];
  neverSay: string[];
  alwaysDo: string[];
  blockedTopics: string[];
  canSearchProducts: boolean;
  canReadReviews: boolean;
  canReadBlogs: boolean;
  canCheckOrders: boolean;
  canAnswerOffTopic: boolean;
  canQuotePrices: boolean;
  maxMessagesPerVisitorPerDay: number;
  maxMessagesPerDay: number;
  maxMessageLength: number;
  maxHistoryTurns: number;
  thinkingBudgetCap: number;
  thinkingEnabled: boolean;
  limitReachedMessage: string;
  unavailableMessage: string;
  isEnabled: boolean;
  extraInstructions: string;
  updatedAt?: string;
  updatedBy?: string | null;
}

export interface ChatbotUsage {
  day: string;
  messagesToday: number;
  visitorsToday: number;
  dailyCap: number;
  perVisitorCap: number;
  capUsedPercent: number;
  busiestVisitors: { visitor: string; messages: number }[];
}

export async function getChatbotConfig(): Promise<ChatbotConfig> {
  const { data } = await apiClient.get<{ data: ChatbotConfig }>("/admin/chatbot/config");
  return data.data;
}

/** The Studio holds the raw config row in state, bookkeeping columns and
 * all. Those columns are not settings — id is the singleton's, updatedAt is
 * the database's, updatedBy is the server's — and the API's strict
 * validation has already rejected payloads carrying unexpected fields once.
 * Strip them at this single choke point before any request leaves. */
function editableFields(payload: Partial<ChatbotConfig>): Partial<ChatbotConfig> {
  const { id: _id, updatedAt: _updatedAt, updatedBy: _updatedBy, ...editable } = payload as Record<string, unknown>;
  return editable as Partial<ChatbotConfig>;
}

export async function updateChatbotConfig(
  payload: Partial<ChatbotConfig>,
): Promise<ChatbotConfig> {
  const { data } = await apiClient.patch<{ data: ChatbotConfig }>(
    "/admin/chatbot/config",
    editableFields(payload),
  );
  return data.data;
}

/** The exact instructions these settings produce — without saving them. */
export async function previewChatbotConfig(
  payload: Partial<ChatbotConfig>,
): Promise<{ systemInstruction: string; tools: string[]; instructionWords: number }> {
  const { data } = await apiClient.post<{
    data: { systemInstruction: string; tools: string[]; instructionWords: number };
  }>("/admin/chatbot/config/preview", editableFields(payload));
  return data.data;
}

export async function getChatbotUsage(): Promise<ChatbotUsage> {
  const { data } = await apiClient.get<{ data: ChatbotUsage }>("/admin/chatbot/usage");
  return data.data;
}

export interface ExtractedRuleDraft {
  trigger: string;
  instruction: string;
}

/** Distills a sandbox conversation into an editable rule draft via Gemini.
 * Returns the sidecar payload directly — NOT wrapped in { data }. */
export async function extractChatbotRule(
  history: { role: string; content?: string }[],
): Promise<ExtractedRuleDraft> {
  const { data } = await apiClient.post<ExtractedRuleDraft>("/chatbot/train/extract", { history });
  return data;
}
