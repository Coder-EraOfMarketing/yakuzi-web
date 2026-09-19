import type{Config}from"tailwindcss";
// The shared packages are scanned too. Tailwind only emits the utilities it
// finds in `content`, so a class used solely inside @yukizi/product-form or
// @yukizi/ui was never generated and that markup rendered half-styled here —
// the payout estimate modal lost `max-w-3xl` and `gap-x-12`, so it grew past
// the viewport and its two columns ran into each other.
const c:Config={darkMode:["class"],content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}","../../packages/product-form/src/**/*.{ts,tsx}","../../packages/ui/src/**/*.{ts,tsx}"],theme:{extend:{fontFamily:{sans:["var(--font-inter)","system-ui"]},colors:{border:"hsl(var(--border))",background:"hsl(var(--background))",foreground:"hsl(var(--foreground))",primary:{DEFAULT:"hsl(var(--primary))",foreground:"hsl(var(--primary-foreground))"},muted:{DEFAULT:"hsl(var(--muted))",foreground:"hsl(var(--muted-foreground))"},accent:{DEFAULT:"hsl(var(--accent))",foreground:"hsl(var(--accent-foreground))"},card:{DEFAULT:"hsl(var(--card))",foreground:"hsl(var(--card-foreground))"},input:"hsl(var(--input))",ring:"hsl(var(--ring))"}}}};
export default c;
