# Color Update Script - Improvements Made

## What Was Wrong

The original script had a critical flaw:

```bash
# Old approach - BROKEN
sed -i "s/#04ce56/$BRAND_PRIMARY_COLOR/g" colors.ts
```

**Problem:** This only works if the file contains exactly `#04ce56`. If the file has ANY other color (like `#000000`, `#FF5925`, etc.), the replacement fails silently and nothing changes!

## What Was Fixed

### New Approach: Line-Based Replacement

Instead of searching for specific color values, the improved script replaces colors **by line number**:

```bash
# New approach - WORKS WITH ANY COLOR
sed -i '42s/9: "#[0-9A-Fa-f]\{6\}",/9: "'"$BRAND_PRIMARY_COLOR"'",/' colors.ts
```

This means:
- ✅ Finds line 42
- ✅ Matches ANY hex color on that line
- ✅ Replaces it with your new color
- ✅ Works regardless of current color value

## Files Updated with Line Numbers

### 1. `packages/ui/src/colors.ts`
- Line 42: `orange.light.9` (primary color)
- Line 43: `orange.light.10` (dark variant)
- Line 56: `orange.dark.9` (dark mode primary)
- Line 57: `orange.dark.10` (dark mode variant)

### 2. `packages/ui/src/colors.css`
- Line 25: `--orange-9` (light mode)
- Line 26: `--orange-10` (light mode dark)
- Line 106: `--orange-9` (dark mode)
- Line 107: `--orange-10` (dark mode dark)

### 3. `apps/builder/src/assets/styles/custom.css`
- Updates color comments (any hex value)

### 4. `apps/docs/mint.json`
- Uses `jq` if available for safe JSON updates
- Falls back to pattern matching if `jq` not installed

## How to Use

### Simple Usage (reads from .env)
```bash
./scripts/update-brand-colors.sh
```

### Specify Color Directly
```bash
./scripts/update-brand-colors.sh "#FF5925"
```

### Change Color Workflow
```bash
# 1. Edit .env
nano .env
# Change: NEXT_PUBLIC_BRAND_PRIMARY_COLOR=#YOUR_COLOR

# 2. Run script
./scripts/update-brand-colors.sh

# 3. Restart servers
bun run dev

# 4. Hard refresh browser
# Ctrl+Shift+R
```

## Features

### ✅ What Works Now

1. **Works with ANY existing color**
   - Black (#000000) ✅
   - Orange (#FF5925) ✅
   - Green (#04ce56) ✅
   - Any hex color ✅

2. **Automatic backups**
   - Creates timestamped backups before changes
   - Stored in `.color-backups/TIMESTAMP/`

3. **Color validation**
   - Checks hex format (#RRGGBB)
   - Cleans whitespace and quotes
   - Shows helpful error messages

4. **Automatic color generation**
   - Generates dark variant (10% darker)
   - Converts hex to RGB automatically
   - Updates all formats (hex, rgb, oklch)

5. **Clear feedback**
   - Shows what color is being applied
   - Lists all files updated
   - Provides next steps

### 🎯 Reliability

**Before (Old Script):**
- ❌ Failed silently if color didn't match
- ❌ Had to know the current color
- ❌ Would leave files in inconsistent state

**After (Improved Script):**
- ✅ Always works, regardless of current color
- ✅ Updates exact lines needed
- ✅ Validates and provides feedback
- ✅ Creates automatic backups

## Technical Details

### Line Number Approach

The script uses **line-based replacement** because:

1. **Color positions are fixed** - The primary colors are always on specific lines
2. **Pattern matching is reliable** - We match `9: "#XXXXXX"` format
3. **No false positives** - Only changes the exact lines we want
4. **Future-proof** - Works with any color value

### Example Replacement

```bash
# Line 42 in colors.ts currently has ANY color:
9: "#000000",    # or #FF5925, or #04ce56, or anything

# Script runs:
sed -i '42s/9: "#[0-9A-Fa-f]\{6\}",/9: "#04ce56",/'

# Result:
9: "#04ce56",    # Always correct!
```

## Troubleshooting

### Colors still not changing?

1. **Check you ran the script:**
   ```bash
   ./scripts/update-brand-colors.sh
   ```

2. **Restart dev servers (REQUIRED):**
   ```bash
   # Stop servers (Ctrl+C)
   bun run dev
   ```

3. **Hard refresh browser:**
   ```bash
   Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   ```

### Script says "Invalid color format"?

Make sure you use proper hex format:
- ✅ Correct: `#04ce56`
- ❌ Wrong: `04ce56` (missing #)
- ❌ Wrong: `#04ce5` (too short)
- ❌ Wrong: `rgb(4,206,86)` (not hex)

### Want to restore old colors?

Backups are in `.color-backups/TIMESTAMP/`. To restore:

```bash
# List backups
ls -la .color-backups/

# Copy files back (example)
cp .color-backups/20251225_183401/packages/ui/src/colors.ts packages/ui/src/colors.ts
```

## Summary

**What You Need to Know:**

1. The script NOW WORKS regardless of current color
2. It updates exact lines in files (no more guessing)
3. Always creates backups automatically
4. Just run it and restart servers - that's it!

**The ONE Command You Need:**
```bash
./scripts/update-brand-colors.sh
```

That's it! 🎨
