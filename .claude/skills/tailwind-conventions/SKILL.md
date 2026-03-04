---
name: tailwind-conventions
description: Tailwind CSS + shadcn/ui conventions for Golden Tier Peptide. Auto-activates when writing styles, creating UI components, or working on visual design. Enforces brand colors, spacing, typography, and design system patterns.
user-invocable: false
---

# Tailwind CSS Conventions — Golden Tier Peptide

## Brand Colors — Always use these exact values

```
Gold (primary):   #D4AF37  — text-[#D4AF37], border-[#D4AF37], bg-[#D4AF37]
Gold (dark):      #AA771C  — text-[#AA771C], from-[#AA771C]
Gold gradient:    bg-gradient-to-r from-[#AA771C] to-[#D4AF37]
Dark bg:          #111     — bg-[#111]
```

### Color usage by context:
```
Headings/accent text:   text-[#D4AF37] or text-[#AA771C]
Borders/dividers:       border-[#D4AF37]/20  (20% opacity)
Hover borders:          hover:border-[#D4AF37]
Subtle gold bg:         bg-[#D4AF37]/10
Primary CTA button:     bg-[#111] text-white hover:bg-black
Gold text gradient:     text-transparent bg-clip-text bg-gradient-to-r from-[#AA771C] to-[#D4AF37]
```

## Typography Scale

```
Page titles:       font-serif text-4xl (or larger) — uses the serif font
Section headings:  font-serif text-2xl
Labels/tags:       text-[9px] font-bold tracking-[0.3em] uppercase
Body text:         text-sm text-slate-600
Muted text:        text-xs text-slate-400
```

### Tracking (letter-spacing) conventions:
```
Uppercase labels:  tracking-[0.3em] or tracking-[0.2em]
Normal body:       tracking-wide
Headings:          tracking-tight
```

## Card Pattern (standard product/content card)
```html
<div class="relative bg-white border border-[#D4AF37]/20 overflow-hidden
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
            hover:shadow-[0_20px_40px_rgba(212,175,55,0.08)]
            transition-all duration-500 hover:-translate-y-2">
```

## Button Patterns

### Primary (dark) button:
```html
<button class="bg-[#111] text-white hover:bg-black border border-[#111]
               transition-all duration-300 px-6 py-3 font-medium tracking-wide">
```

### Gold outline button:
```html
<button class="border border-[#D4AF37]/30 text-[#AA771C]
               hover:text-[#D4AF37] hover:border-[#D4AF37]
               transition-all duration-300">
```

### Disabled state:
```html
<button class="bg-slate-50 border border-slate-200 text-slate-300 cursor-not-allowed">
```

## Badge/Tag Pattern
```html
<!-- Status badge -->
<span class="px-3 py-1 bg-white border border-[#D4AF37]/20
             text-[#D4AF37] text-[9px] font-bold tracking-[0.3em] uppercase shadow-sm">
  NEW
</span>

<!-- Status colors -->
bg-emerald-50 text-emerald-600 border-emerald-100  -- active/success
bg-red-50 text-red-600 border-red-100              -- error/out-of-stock
bg-amber-50 text-amber-600 border-amber-100        -- warning/low-stock
bg-slate-100 text-slate-600                        -- neutral/pending
```

## Form Input Pattern
```html
<input class="w-full px-4 py-3 border border-slate-200 rounded-none
              focus:outline-none focus:border-[#D4AF37]
              text-sm text-slate-900 placeholder:text-slate-400
              transition-colors duration-200" />
```

## Spacing & Layout

```
Page padding:      px-8 py-12 (desktop)  px-4 py-6 (mobile)
Section gap:       space-y-8 or gap-8
Card padding:      p-8 (large cards)  p-6 (medium)  p-4 (compact)
Dividers:          border-t border-[#D4AF37]/10
```

## Responsive Breakpoints
```
Mobile-first: default → sm (640px) → md (768px) → lg (1024px) → xl (1280px)

Grid patterns:
  Product grid:    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
  Dashboard:       grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4
  Admin table:     Use overflow-x-auto wrapper for tables
```

## Animation Conventions

```html
<!-- Hover shimmer effect (used on CTA buttons) -->
<div class="absolute inset-0 bg-gradient-to-r from-transparent
            via-[#D4AF37]/20 to-transparent
            -translate-x-[150%] animate-[shimmer_3s_infinite]" />

<!-- Slide underline on hover -->
<span class="absolute bottom-0 left-0 w-0 h-[2px]
             bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]
             transition-all duration-500 ease-out group-hover:w-full" />
```

## Design System Do's and Don'ts

### ✅ Do:
- Use `cn()` from `@/lib/utils` for all conditional class merging
- Use Tailwind opacity modifiers: `border-[#D4AF37]/20` for 20% opacity
- Use `group` and `group-hover:` for parent-controlled hover states
- Use `transition-all duration-300` as standard transition
- Use `rounded-none` for sharp corners (luxury aesthetic — avoid rounded-xl)
- Use `font-serif` for headings/prices, `font-sans` for body

### ❌ Don't:
- Use `rounded-xl` or `rounded-full` — this project uses sharp corners
- Use Tailwind's default blue focus ring — use `focus:border-[#D4AF37]` instead
- Use hardcoded hex colors in inline styles when a Tailwind class exists
- Use `text-yellow-400` etc — always use the exact brand `#D4AF37`

## Loading/Skeleton Pattern
```html
<div class="absolute inset-0 bg-slate-100 animate-pulse" />
```

## Empty State Pattern
```html
<div class="flex flex-col items-center justify-center py-16 text-center">
  <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
    <Icon class="h-8 w-8 text-slate-400" />
  </div>
  <p class="text-slate-900 font-medium">Nothing here yet</p>
  <p class="text-sm text-slate-500 mt-1">Descriptive sub-text</p>
</div>
```
