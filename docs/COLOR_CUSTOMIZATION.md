# Color Customization Guide

This document explains how brand colors work in the Typebot white-label setup.

## How It Works

### Current Approach: Build-Time Color Replacement

The platform uses a **build-time replacement** approach for colors, not runtime dynamic colors. Here's why:

1. **CSS Limitations**: CSS files cannot directly read environment variables at runtime
2. **Performance**: Build-time replacement is faster than runtime CSS-in-JS
3. **Simplicity**: No complex build tooling or CSS-in-JS overhead

### Color Flow

```
.env (NEXT_PUBLIC_BRAND_PRIMARY_COLOR)
  ↓
setup-white-label.sh or update-brand-colors.sh
  ↓
Replaces hardcoded colors in:
  - packages/ui/src/colors.ts (TypeScript color constants)
  - packages/ui/src/colors.css (CSS custom properties)
  - apps/builder/src/assets/styles/custom.css (Builder overrides)
  - apps/docs/mint.json (Docs theme)
  ↓
Build/Dev server reads updated files
  ↓
Colors appear in the UI
```

## Files Where Colors Are Defined

### 1. `packages/ui/src/colors.ts`
**Purpose**: TypeScript color constants used in React components

```typescript
orange: {
  light: {
    9: "#04ce56",  // ← Your brand color
    10: "#03b54a", // ← Darker shade
  }
}
```

### 2. `packages/ui/src/colors.css`
**Purpose**: CSS custom properties for the color system

```css
--orange-9: rgb(4 206 86);  /* ← Your brand color */
--orange-10: rgb(3 181 74); /* ← Darker shade */
```

### 3. `apps/builder/src/assets/styles/custom.css`
**Purpose**: Tailwind v4 oklch color overrides

```css
--color-orange-500: oklch(0.75 0.18 150); /* #04ce56 */
--primary: oklch(0.75 0.18 150);
```

### 4. `apps/docs/mint.json`
**Purpose**: Mintlify documentation theme

```json
{
  "colors": {
    "primary": "#04ce56"
  }
}
```

## Usage

### Method 1: Full Setup (First Time)

Run the setup script which collects all branding info including colors:

```bash
./scripts/setup-white-label.sh
```

This will:
1. Create/update `.env` with your brand color
2. Replace all color values in the codebase
3. Generate color variations (light/dark shades)

### Method 2: Update Colors Only

If you just want to change the color without re-running full setup:

```bash
# Using color from .env
./scripts/update-brand-colors.sh

# Or specify a color directly
./scripts/update-brand-colors.sh "#FF5925"
```

This will:
1. Backup existing files to `.color-backups/`
2. Replace all color occurrences
3. Update `.env` with the new color

### Method 3: Manual Update

1. Update the color in `.env`:
   ```bash
   NEXT_PUBLIC_BRAND_PRIMARY_COLOR=#YOUR_COLOR
   ```

2. Run the update script:
   ```bash
   ./scripts/update-brand-colors.sh
   ```

3. Restart dev servers:
   ```bash
   bun run dev
   ```

## Why Not Runtime Environment Variables?

You might wonder: "Why not read `NEXT_PUBLIC_BRAND_PRIMARY_COLOR` at runtime?"

**CSS can't access env variables at runtime.** The only ways would be:

1. **CSS-in-JS** (styled-components, emotion)
   - ❌ Adds significant bundle size
   - ❌ Runtime performance cost
   - ❌ Hydration complexity

2. **CSS Variables with inline styles**
   ```html
   <style>:root { --primary: <?= env('COLOR') ?> }</style>
   ```
   - ❌ Requires server-side rendering
   - ❌ Can't work with static exports
   - ❌ Breaks with CDN/static hosting

3. **Build-time replacement** (current approach)
   - ✅ Zero runtime cost
   - ✅ Works with static exports
   - ✅ Simple to understand
   - ✅ Easy to debug

## Where Colors Are Used

Your brand primary color (`--orange-9` / `orange.light.9`) is used for:

- ✅ **Chatbot UI**:
  - Guest bubbles (user messages)
  - Buttons and CTAs
  - Progress bars
  - Border accents

- ✅ **Builder Interface**:
  - Primary buttons
  - Active states
  - Focus rings
  - Links and highlights

- ✅ **Documentation**:
  - Primary color theme
  - Link colors
  - Code highlights

## Color Naming Convention

Why is it called "orange" if it's green? **Historical reasons!**

- The original Typebot used orange (#FF5924) as the primary brand color
- All the code references used `orange.light.9`, `--orange-9`, etc.
- When white-labeling, we **override** the orange values with your brand color
- This avoids having to change hundreds of references throughout the codebase

Think of it as: `orange = primary brand color` (which happens to be green for you!)

## Troubleshooting

### Colors not updating after running script

1. **Restart dev servers** (important!):
   ```bash
   # Stop current servers (Ctrl+C)
   bun run dev
   ```

2. **Hard refresh browser**:
   - Chrome/Edge: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` or `Cmd+Shift+R`

3. **Clear Next.js cache**:
   ```bash
   rm -rf apps/builder/.next apps/viewer/.next
   bun run dev
   ```

### Colors work in builder but not viewer

The viewer needs the logo in its public folder:

```bash
cp apps/builder/public/images/logo.png apps/viewer/public/images/logo.png
```

### Script errors about sed or permissions

Make sure scripts are executable:

```bash
chmod +x scripts/setup-white-label.sh
chmod +x scripts/update-brand-colors.sh
```

## Advanced: Adding New Color Usages

If you add new UI components that need the brand color:

1. **In React/TypeScript**:
   ```typescript
   import { colors } from '@typebot.io/ui/colors'

   const buttonStyle = {
     backgroundColor: colors.orange.light[9] // Your brand color
   }
   ```

2. **In CSS**:
   ```css
   .my-component {
     background-color: var(--orange-9);
     /* or using Tailwind */
     @apply bg-orange-9;
   }
   ```

3. **In Tailwind classes**:
   ```tsx
   <button className="bg-orange-9 hover:bg-orange-10">
     Click me
   </button>
   ```

## Summary

**Do you need the scripts?**

✅ **YES** - The scripts are essential because:
- CSS files need physical color values (can't read from .env at runtime)
- The scripts replace all hardcoded color references with your brand color
- Without running the scripts, your `.env` color won't be applied

**Is it managed from .env?**

🟡 **PARTIALLY** - The workflow is:
1. You set the color in `.env`
2. Run the script to apply it to all files
3. The build process reads the updated files
4. Your color appears in the UI

It's a **two-step process**: `.env` → Script → Files → Build → UI

The `.env` is the source of truth, but the scripts are what actually apply it!
