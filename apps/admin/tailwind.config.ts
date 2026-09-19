import type{Config}from"tailwindcss";
// The shared packages are scanned too: this app renders @yukizi/product-form
// on "add for seller", and Tailwind only emits the utilities it finds in
// `content`, so classes used solely inside that package never existed here.
const c:Config={darkMode:["class"],content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}","../../packages/product-form/src/**/*.{ts,tsx}","../../packages/ui/src/**/*.{ts,tsx}"],theme:{extend:{fontFamily:{sans:["var(--font-inter)","system-ui"]},colors:{border:"hsl(var(--border))",background:"hsl(var(--background))",foreground:"hsl(var(--foreground))",primary:{DEFAULT:"hsl(var(--primary))",foreground:"hsl(var(--primary-foreground))"},muted:{DEFAULT:"hsl(var(--muted))",foreground:"hsl(var(--muted-foreground))"},accent:{DEFAULT:"hsl(var(--accent))",foreground:"hsl(var(--accent-foreground))"},card:{DEFAULT:"hsl(var(--card))",foreground:"hsl(var(--card-foreground))"},input:"hsl(var(--input))",ring:"hsl(var(--ring))"}}},plugins:[require("@tailwindcss/typography")]};
export default c;
