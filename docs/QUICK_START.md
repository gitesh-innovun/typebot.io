# Quick Start: Testing Your White-Label Branding

**Last Updated**: 2025-12-25

---

## What's Been Applied

The branding system has been integrated into the builder app! Here's what now uses your brand configuration:

### ✅ Page Titles & Metadata
- **File**: `/apps/builder/src/components/Seo.tsx`
- **What Changed**: Page titles now show your brand name instead of "Typebot"
  - Example: "Dashboard | YourBrand" (instead of "Dashboard | Typebot")
  - Meta descriptions use your brand tagline
  - Theme color set to your primary brand color

### ✅ Billing UI (Conditionally Hidden)
- **Files Modified**:
  - `/apps/builder/src/features/workspace/components/WorkspaceSettingsDialog.tsx`
  - `/apps/builder/src/features/dashboard/components/DashboardPage.tsx`
- **What Changed**: Billing/subscription UI is hidden when `DISABLE_BILLING=true`
  - No "Billing & Usage" tab in settings
  - No checkout dialogs

---

## How to Test

### 1. Set Your Branding Environment Variables

Edit your `.env` file (or create one if it doesn't exist):

```bash
# Brand Identity
BRAND_NAME=MyAwesomeBot
BRAND_DISPLAY_NAME="My Awesome Bot"
BRAND_TAGLINE="Build amazing chatbots easily"
BRAND_DESCRIPTION="My Awesome Bot helps you create powerful conversational experiences"
BRAND_PRIMARY_COLOR=#0066CC

# Disable Billing
DISABLE_BILLING=true
BILLING_MODE=UNLIMITED

# Other required variables (minimal)
ENCRYPTION_SECRET=your-32-character-encryption-secret
DATABASE_URL=postgresql://postgres:password@localhost:5432/mybot_db
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_VIEWER_URL=http://localhost:3001
```

### 2. Start the Development Server

```bash
# Make sure dependencies are installed
bun install

# Start the builder app
cd apps/builder
bun run dev

# Or from root:
bun run dev
```

### 3. Open Your Browser

Navigate to: http://localhost:3000

### 4. Verify Branding Changes

#### Check Browser Tab Title
- Should show: "Sign in | My Awesome Bot" (or your brand name)
- NOT "Sign in | Typebot"

#### Check Settings Dialog
1. Sign in / create an account
2. Go to Settings (gear icon)
3. Verify:
   - ✅ **No "Billing & Usage" tab** should appear (if DISABLE_BILLING=true)
   - ✅ **No subscription/payment prompts**

#### Check Meta Tags
1. Right-click → View Page Source
2. Look in `<head>` section:
   - `<title>` should contain your brand name
   - `<meta name="theme-color">` should have your primary color

---

## What's Still Hardcoded (Known Limitations)

### 1. i18n Translation Files
**Location**: `/apps/builder/src/i18n/*.json`
**Issue**: Some UI text still references "Typebot"
**Fix Needed**: Manual update of translation strings

**Example** (from `en.json`):
```json
{
  "account.suspendedAccount.text": "Your workspace has been quarantined because it was used in a way that violates Typebot's terms of service."
}
```

Should become:
```json
{
  "account.suspendedAccount.text": "Your workspace has been quarantined because it was used in a way that violates our terms of service."
}
```

### 2. Visual Assets (Logos/Favicons)
**Location**:
- `/apps/builder/public/favicon.svg`
- `/apps/builder/public/images/logo.png`

**Issue**: Still showing original Typebot logo
**Fix**: Replace these files with your own branded assets

### 3. Header Logo Component
**Location**: `/apps/builder/src/features/dashboard/components/DashboardHeader.tsx`
**Current Behavior**: Shows workspace icon (not brand logo)
**Note**: This is actually by design - each workspace has its own icon

---

## Quick Fixes

### Replace Favicon

```bash
# Replace with your own SVG logo
cp /path/to/your-logo.svg apps/builder/public/favicon.svg
cp /path/to/your-logo.svg apps/landing-page/public/images/favicon.svg
```

### Update Meta Description Globally

Already done! It now uses `brandConfig.description` from your `.env`

### Test Different Brand Colors

Just update `.env` and refresh:

```bash
# In .env
BRAND_PRIMARY_COLOR=#FF0000  # Red
BRAND_SECONDARY_COLOR=#00FF00  # Green
```

Then restart the dev server:
```bash
bun run dev
```

---

## Debugging

### Branding Not Showing?

1. **Check Environment Variables Are Loaded**
   ```bash
   echo $BRAND_NAME
   # Should output your brand name
   ```

2. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private window

3. **Check Build**
   ```bash
   # Rebuild the app
   bun run build
   ```

4. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Look for any errors in Console tab
   - Check Network tab for failed requests

### Billing Still Showing?

1. **Verify Environment Variable**
   ```bash
   # In .env, make sure you have:
   DISABLE_BILLING=true
   BILLING_MODE=UNLIMITED
   ```

2. **Restart Dev Server**
   - Stop the server (Ctrl+C)
   - Start again: `bun run dev`

3. **Check the Code**
   - File: `/apps/builder/src/features/workspace/components/WorkspaceSettingsDialog.tsx`
   - Line 123 should have: `{currentUserMode === "write" && isBillingEnabled() && (`

---

## What's Next?

### To Fully Remove "Typebot" References

See our comprehensive guides:
- [Implementation Log](/docs/IMPLEMENTATION_LOG.md) - Detailed changes made
- [Deployment Guide](/docs/DEPLOYMENT_GUIDE.md) - Production deployment
- [Codebase Analysis](/docs/CODEBASE_ANALYSIS.md) - Full architecture details

### Production Deployment

When ready to deploy:

1. **Update `.env` with production values**
   ```bash
   NEXT_PUBLIC_BUILDER_URL=https://app.yourbrand.com
   NEXT_PUBLIC_VIEWER_URL=https://chat.yourbrand.com
   BRAND_NAME=YourBrand
   DISABLE_BILLING=true
   ```

2. **Replace all logo assets**
   - See [Asset Replacement Guide](/docs/DEPLOYMENT_GUIDE.md#asset-replacement)

3. **Build for production**
   ```bash
   bun run build
   bun start
   ```

4. **Follow deployment checklist**
   - See [Production Checklist](/docs/DEPLOYMENT_GUIDE.md#production-checklist)

---

## Support

- **Documentation**: See `/docs` folder
- **Setup Script**: Run `./scripts/setup-white-label.sh` for guided setup
- **Issues**: Check [Implementation Log - Known Issues](/docs/IMPLEMENTATION_LOG.md#known-issues--limitations)

---

**Quick Test Checklist**:
- [ ] Browser tab title shows my brand name
- [ ] No "Billing & Usage" tab in settings (if DISABLE_BILLING=true)
- [ ] Meta description uses my tagline
- [ ] Theme color matches my primary color
- [ ] No subscription prompts appear

---

Happy white-labeling! 🎨
