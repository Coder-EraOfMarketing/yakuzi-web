"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Eye,
  Gauge,
  Loader2,
  MessageSquare,
  Package,
  Power,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button, Tabs } from "@/components/ui";
import {
  getChatbotConfig,
  getChatbotUsage,
  previewChatbotConfig,
  updateChatbotConfig,
  type ChatbotConfig,
  type ChatbotUsage,
} from "@/api/chatbot.api";
import { Dial, NumberField, PhraseList, Section, Toggle } from "@/components/chatbot/studio-controls";

/**
 * Chatbot Studio — everything about how the assistant behaves, in one place.
 *
 * The organising idea: an owner should never have to write a prompt, and should
 * never have to wonder what the assistant can reach. So the dials write the
 * prompt, the switches are a map of the site, and the "What it's told" panel
 * shows the exact result before anything is saved.
 */

/** The sentence each dial position produces — mirrors persona-compiler.ts. */
const reading = {
  formality: (v: number) =>
    v <= 25
      ? "Talks casually, like a friendly shop assistant. Contractions, no stiffness."
      : v >= 75
        ? "Talks formally and professionally. Full sentences, no slang."
        : "No instruction either way — it uses its natural voice.",
  warmth: (v: number) =>
    v <= 25
      ? "Neutral and factual. Answers the question and stops."
      : v >= 75
        ? "Genuinely warm. Acknowledges how someone feels before solving the problem."
        : "No instruction either way — polite by default.",
  detail: (v: number) =>
    v <= 25
      ? "Answers in one or two sentences. Offers more only if asked."
      : v >= 75
        ? "Explains thoroughly — reasoning, alternatives, and what you'd ask next."
        : "Keeps answers short unless the question needs more.",
  emoji: (v: number) =>
    v <= 25 ? "Never uses emoji." : v >= 75 ? "Uses emoji freely." : "At most one per reply, only where it adds warmth.",
  salesiness: (v: number) =>
    v <= 25
      ? "Never upsells. Won't suggest products unless asked what's available."
      : v >= 75
        ? "Actively recommends products that fit, and says why each one fits."
        : "Recommends only when it genuinely answers the question.",
};

export default function ChatbotStudioPage() {
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [saved, setSaved] = useState<ChatbotConfig | null>(null);
  const [usage, setUsage] = useState<ChatbotUsage | null>(null);
  const [tab, setTab] = useState("personality");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [compiled, setCompiled] = useState<{ systemInstruction: string; tools: string[] } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [c, u] = await Promise.all([getChatbotConfig(), getChatbotUsage().catch(() => null)]);
        setConfig(c);
        setSaved(c);
        setUsage(u);
      } catch {
        toast.error("Could not load the chatbot settings");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Unsaved-change detection by value, so moving a dial and moving it back
  // correctly leaves you with nothing to save.
  const isDirty = useMemo(
    () => Boolean(config && saved) && JSON.stringify(config) !== JSON.stringify(saved),
    [config, saved],
  );

  const set = useCallback(<K extends keyof ChatbotConfig>(key: K, value: ChatbotConfig[K]) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const save = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      const updated = await updateChatbotConfig(config);
      setConfig(updated);
      setSaved(updated);
      toast.success("Saved — the assistant is using these settings now");
    } catch {
      toast.error("Could not save. Nothing was changed.");
    } finally {
      setIsSaving(false);
    }
  };

  const showCompiled = async () => {
    if (!config) return;
    try {
      const result = await previewChatbotConfig(config);
      setCompiled(result);
    } catch {
      toast.error("Could not build the preview");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Loading the studio…</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="mx-auto mt-20 max-w-lg rounded-2xl border border-border p-6 text-center">
        <h2 className="text-xl font-bold">Settings unavailable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The chatbot settings could not be loaded. Reload the page to try again.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-28">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/chatbot" className="rounded-xl p-2 hover:bg-muted" aria-label="Back to chatbot">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Chatbot Studio</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              How your assistant speaks, what it can see, and what it may cost.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => set("isEnabled", !config.isEnabled)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            config.isEnabled
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          <Power className="h-4 w-4" />
          {config.isEnabled ? "Assistant is live" : "Assistant is off"}
        </button>
      </div>

      {/* Today's volume against the ceiling — the number that becomes a bill. */}
      {usage && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <p className="text-xs font-medium text-muted-foreground">Messages today</p>
            <p className="mt-1 text-2xl font-semibold">{usage.messagesToday.toLocaleString()}</p>
            {usage.dailyCap > 0 && (
              <>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${usage.capUsedPercent > 85 ? "bg-red-500" : "bg-primary"}`}
                    style={{ width: `${usage.capUsedPercent}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {usage.capUsedPercent}% of today&apos;s ceiling of {usage.dailyCap.toLocaleString()}
                </p>
              </>
            )}
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <p className="text-xs font-medium text-muted-foreground">People who chatted</p>
            <p className="mt-1 text-2xl font-semibold">{usage.visitorsToday.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">Each capped at {usage.perVisitorCap || "∞"} messages</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <p className="text-xs font-medium text-muted-foreground">Heaviest user today</p>
            <p className="mt-1 text-2xl font-semibold">
              {usage.busiestVisitors[0]?.messages ?? 0}
              <span className="ml-1 text-sm font-normal text-muted-foreground">messages</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {usage.busiestVisitors.length > 1
                ? `Next: ${usage.busiestVisitors.slice(1, 3).map((b) => b.messages).join(", ")}`
                : "No one is running away with it"}
            </p>
          </div>
        </div>
      )}

      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { label: "Personality", value: "personality" },
          { label: "What it can see", value: "access" },
          { label: "Limits", value: "limits" },
          { label: "Boundaries", value: "boundaries" },
          { label: "What it's told", value: "compiled" },
        ]}
      />

      {tab === "personality" && (
        <Section
          title="Personality"
          description="Move a dial and read the sentence underneath — that is exactly what the assistant is told."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
              <label className="text-sm font-semibold">Its name</label>
              <input
                value={config.assistantName}
                maxLength={60}
                onChange={(e) => set("assistantName", e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <label className="mt-4 block text-sm font-semibold">One-line description</label>
              <input
                value={config.tagline}
                maxLength={140}
                placeholder="Optional — shown under the name"
                onChange={(e) => set("tagline", e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
              <label className="text-sm font-semibold">First thing it says</label>
              <textarea
                value={config.greeting}
                maxLength={500}
                rows={5}
                onChange={(e) => set("greeting", e.target.value)}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Dial label="Formality" hint="How it addresses people" low="Casual" high="Formal"
              value={config.formality} onChange={(v) => set("formality", v)} reading={reading.formality(config.formality)} />
            <Dial label="Warmth" hint="How much it acknowledges feelings" low="Factual" high="Warm"
              value={config.warmth} onChange={(v) => set("warmth", v)} reading={reading.warmth(config.warmth)} />
            <Dial label="Length" hint="How much it says at once" low="Brief" high="Thorough"
              value={config.detail} onChange={(v) => set("detail", v)} reading={reading.detail(config.detail)} />
            <Dial label="Emoji" hint="How playful it looks" low="None" high="Freely"
              value={config.emoji} onChange={(v) => set("emoji", v)} reading={reading.emoji(config.emoji)} />
            <Dial label="Selling" hint="How hard it recommends products" low="Never" high="Actively"
              value={config.salesiness} onChange={(v) => set("salesiness", v)} reading={reading.salesiness(config.salesiness)} />
            <PhraseList
              label="Languages it may reply in"
              description="It answers in the language the customer wrote in, if it's on this list."
              placeholder="e.g. Bengali"
              items={config.languages}
              onChange={(v) => set("languages", v)}
              max={10}
            />
          </div>
        </Section>
      )}

      {tab === "access" && (
        <Section
          title="What it can see"
          description="Every part of your site the assistant can reach. Switch one off and it stops looking there — and says the sensible thing instead."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              label="Product catalogue"
              description="Looks up real products, stock and manufacturers before answering."
              whenOff="Won't check the catalogue — sends people to the shop page instead."
              checked={config.canSearchProducts}
              onChange={(v) => set("canSearchProducts", v)}
            />
            <Toggle
              label="Prices"
              description="States prices exactly as the catalogue reports them."
              whenOff="Never says a price — describes the product and points to its page."
              checked={config.canQuotePrices}
              onChange={(v) => set("canQuotePrices", v)}
            />
            <Toggle
              label="Customer reviews"
              description="Answers 'is it any good?' from real reviews instead of guessing."
              whenOff="Won't quote reviews — points to the product page."
              checked={config.canReadReviews}
              onChange={(v) => set("canReadReviews", v)}
            />
            <Toggle
              label="Blog articles"
              description="Searches your blog and can quote and link articles."
              whenOff="Won't mention or quote the blog at all."
              checked={config.canReadBlogs}
              onChange={(v) => set("canReadBlogs", v)}
            />
            <Toggle
              label="Order status"
              description="Looks up an order when the customer gives the order number themselves."
              whenOff="Won't look up orders — sends people to My Orders or support."
              checked={config.canCheckOrders}
              onChange={(v) => set("canCheckOrders", v)}
            />
            <Toggle
              label="Questions beyond the store"
              description="Answers general questions properly, like any AI assistant."
              whenOff="Only discusses Yukizi, and politely steers everything else back."
              checked={config.canAnswerOffTopic}
              onChange={(v) => set("canAnswerOffTopic", v)}
            />
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" /> What it can never reach
            </p>
            <ul className="mt-2 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
              <li className="flex items-center gap-2"><Package className="h-3.5 w-3.5" /> Anyone&apos;s address, phone or email</li>
              <li className="flex items-center gap-2"><Tag className="h-3.5 w-3.5" /> Card or payment details</li>
              <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5" /> Seller names, margins or payouts</li>
              <li className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Admin screens and settings</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              These are not switches. The assistant is only given the four lookups above — nothing else is reachable from it.
            </p>
          </div>
        </Section>
      )}

      {tab === "limits" && (
        <Section
          title="Limits"
          description="What a day of chatting is allowed to cost. Every message is counted before it reaches the AI."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Messages per person per day"
              description="Stops one visitor using the whole budget. Resets at midnight, India time."
              value={config.maxMessagesPerVisitorPerDay}
              onChange={(v) => set("maxMessagesPerVisitorPerDay", v)}
              min={0} max={5000} unit="messages"
              zeroMeans="0 means no limit per person."
            />
            <NumberField
              label="Messages across the whole site per day"
              description="Your hard ceiling. Once reached, everyone sees the 'taking a break' message until tomorrow."
              value={config.maxMessagesPerDay}
              onChange={(v) => set("maxMessagesPerDay", v)}
              min={0} max={200000} unit="messages"
              zeroMeans="0 means no ceiling at all — your bill is uncapped."
            />
            <NumberField
              label="Longest message someone can send"
              description="Anything longer is trimmed. Long messages cost more to answer."
              value={config.maxMessageLength}
              onChange={(v) => set("maxMessageLength", v)}
              min={50} max={8000} unit="characters"
            />
            <NumberField
              label="How much of the conversation it remembers"
              description="Older turns are dropped. More memory means better answers and a higher cost per message."
              value={config.maxHistoryTurns}
              onChange={(v) => set("maxHistoryTurns", v)}
              min={0} max={50} unit="past messages"
            />
            <NumberField
              label="Thinking budget"
              description="How hard the AI may think before replying. This is the single biggest lever on cost per answer."
              value={config.thinkingBudgetCap}
              onChange={(v) => set("thinkingBudgetCap", v)}
              min={0} max={8192} unit="units"
            />
            <Toggle
              label="Let it think before answering"
              description="Slower and dearer, but noticeably better on complicated questions."
              whenOff="Replies immediately. Cheapest, and fine for simple questions."
              checked={config.thinkingEnabled}
              onChange={(v) => set("thinkingEnabled", v)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
              <label className="text-sm font-semibold">When someone hits their own limit</label>
              <textarea
                value={config.limitReachedMessage}
                maxLength={500}
                rows={3}
                onChange={(e) => set("limitReachedMessage", e.target.value)}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
              <label className="text-sm font-semibold">When the assistant is off or at its ceiling</label>
              <textarea
                value={config.unavailableMessage}
                maxLength={500}
                rows={3}
                onChange={(e) => set("unavailableMessage", e.target.value)}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        </Section>
      )}

      {tab === "boundaries" && (
        <Section
          title="Boundaries"
          description="Things it must never say, things it must always do, and subjects it should refuse."
        >
          <PhraseList
            label="Never say"
            description="Promises and claims it must never make, however it's phrased."
            placeholder="e.g. guaranteed delivery by tomorrow"
            items={config.neverSay}
            onChange={(v) => set("neverSay", v)}
            tone="danger"
          />
          <PhraseList
            label="Always do"
            description="Things to mention or do whenever they're relevant."
            placeholder="e.g. mention the 7-day return window when asked about refunds"
            items={config.alwaysDo}
            onChange={(v) => set("alwaysDo", v)}
          />
          <PhraseList
            label="Refuse to discuss"
            description="It declines politely and offers to pass the person to a human."
            placeholder="e.g. competitor pricing"
            items={config.blockedTopics}
            onChange={(v) => set("blockedTopics", v)}
            tone="danger"
          />
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <label className="text-sm font-semibold">Anything else</label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Free text, added last. For anything the controls above can&apos;t express.
            </p>
            <textarea
              value={config.extraInstructions}
              maxLength={4000}
              rows={5}
              onChange={(e) => set("extraInstructions", e.target.value)}
              className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </Section>
      )}

      {tab === "compiled" && (
        <Section
          title="What it's told"
          description="The exact instructions your settings produce. Nothing is hidden from you here."
        >
          <div className="flex flex-wrap gap-2">
            <Button onClick={showCompiled} leftIcon={<Eye className="h-4 w-4" />}>
              Build from current settings
            </Button>
            <Link href="/chatbot">
              <Button variant="outline" leftIcon={<MessageSquare className="h-4 w-4" />}>
                Open the test chat
              </Button>
            </Link>
          </div>

          {compiled ? (
            <>
              <div className="flex flex-wrap gap-2">
                {compiled.tools.length ? (
                  compiled.tools.map((t) => (
                    <span key={t} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    No lookups enabled — it answers only from what you taught it
                  </span>
                )}
              </div>
              <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl border border-border/60 bg-muted/30 p-4 text-xs leading-relaxed text-foreground/90">
                {compiled.systemInstruction}
              </pre>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              <Sparkles className="mx-auto mb-2 h-6 w-6 text-primary" />
              Press the button above to see precisely what your assistant is being told.
            </div>
          )}
        </Section>
      )}

      {/* Save bar — only when there is something to save. */}
      {isDirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="h-4 w-4" /> You have unsaved changes. Customers still see the old settings.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setConfig(saved)} disabled={isSaving}>
                Discard
              </Button>
              <Button onClick={save} loading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                Save and go live
              </Button>
            </div>
          </div>
        </div>
      )}

      <p className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
        <BookOpen className="h-3.5 w-3.5" />
        Teaching it specific answers (&quot;when someone asks X, say Y&quot;) lives on the{" "}
        <Link href="/chatbot" className="text-primary underline">
          training page
        </Link>
        .
      </p>
    </div>
  );
}
