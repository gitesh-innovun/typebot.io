# White-Labeling Implementation Log

**Project**: Typebot White-Labeling & Custom Deployment Strategy
**Started**: 2025-12-25
**Status**: In Progress

---

## Table of Contents

1. [Overview](#overview)
2. [Completed Work](#completed-work)
3. [Implementation Details](#implementation-details)
4. [Next Steps](#next-steps)
5. [Testing Instructions](#testing-instructions)

---

## Overview

This document tracks the implementation progress of converting Typebot into a white-labelable platform that can be deployed with custom branding for different clients.

### Goals

1. ✅ **Remove Typebot branding** - Make it configurable
2. ✅ **Centralize branding control** - Single configuration point
3. ✅ **Add billing feature flags** - Support unlimited/custom billing modes
4. 🔄 **Full integration** - Apply branding across all apps
5. ⏳ **Documentation** - Comprehensive deployment guides

---

## Completed Work

### Phase 1: Centralized Branding System ✅

**Date**: 2025-12-25
**Status**: Complete

#### What Was Built

Created a new package `/packages/branding` that serves as the single source of truth for all branding-related configuration.

#### Files Created

```
packages/branding/
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts              # Main exports
│   ├── config.ts             # Brand configuration (environment-based)
│   ├── constants.ts          # Brand constants
│   ├── components/
│   │   ├── Logo.tsx          # Reusable logo component
│   │   └── BrandedFooter.tsx # Reusable footer component
│   ├── theme/
│   │   └── colors.ts         # Color utilities
│   └── utils/
│       └── helpers.ts        # Helper functions
```

#### Key Features

1. **Environment-Based Configuration**
   - Brand name, display name, tagline
   - Domain URLs (builder, viewer, landing, docs)
   - Company information
   - Colors (primary, secondary, accent)
   - Social links
   - Feature flags

2. **Reusable Components**
   - `<Logo />` - Adaptive logo component with size presets
   - `<LogoText />` - Text-based logo
   - `<LogoWithText />` - Combined logo+text
   - `<BrandedFooter />` - Footer with copyright and links

3. **Helper Utilities**
   - `generatePageTitle()` - Consistent page titles
   - `generateMetaDescription()` - SEO descriptions
   - `getDomainUrl()` - Access configured domains
   - `isWhiteLabelMode()` - Check if white-labeled
   - `generateOpenGraphTags()` - Social media meta tags
   - `generateOrganizationStructuredData()` - JSON-LD for SEO

4. **Theme System**
   - `brandColors` - Access brand colors
   - `hexToRgb()` - Color conversion utilities
   - `generateColorShades()` - Generate color variations

#### Environment Variables Added

```bash
# Brand Identity
BRAND_NAME=YourBrand
BRAND_DISPLAY_NAME="Your Brand Name"
BRAND_TAGLINE="Your tagline"
BRAND_DESCRIPTION="Your description"

# Domains
NEXT_PUBLIC_BUILDER_URL=https://app.yourbrand.com
NEXT_PUBLIC_VIEWER_URL=https://chat.yourbrand.com
NEXT_PUBLIC_LANDING_URL=https://yourbrand.com
NEXT_PUBLIC_DOCS_URL=https://docs.yourbrand.com

# Company
COMPANY_NAME="Your Company"
COMPANY_LEGAL_NAME="Your Company Inc."
SUPPORT_EMAIL=support@yourbrand.com
SALES_EMAIL=sales@yourbrand.com

# Colors
BRAND_PRIMARY_COLOR=#0066CC
BRAND_SECONDARY_COLOR=#FF5925
BRAND_ACCENT_COLOR=#00CC66

# Social
BRAND_GITHUB_URL=https://github.com/yourorg
BRAND_DISCORD_URL=https://discord.gg/yourserver
BRAND_TWITTER_URL=https://twitter.com/yourbrand

# Features
SHOW_TYPEBOT_BRANDING=false
SHOW_POWERED_BY=false
ENABLE_MARKETPLACE=true
```

---

### Phase 2: Billing Feature Flags ✅

**Date**: 2025-12-25
**Status**: Complete

#### What Was Modified

1. **Environment Package** (`/packages/env/src/index.ts`)
   - Added new `billingEnv` configuration section
   - Integrated billing flags into main env export

2. **Billing Package** (`/packages/billing/src/helpers/isBillingEnabled.ts`)
   - Created new helper functions for billing mode checks

#### Files Modified

```
packages/env/src/index.ts
```

#### Files Created

```
packages/billing/src/helpers/isBillingEnabled.ts
```

#### Environment Variables Added

```bash
# Billing Configuration
DISABLE_BILLING=true              # Completely disable billing
BILLING_MODE=UNLIMITED            # Options: STRIPE, UNLIMITED, CUSTOM
```

#### New Helper Functions

```typescript
isBillingEnabled()        // Check if billing is active
isUnlimitedBillingMode()  // Check if unlimited mode
isCustomBillingMode()     // Check if custom mode
getBillingMode()          // Get current mode
shouldUseStripe()         // Check if Stripe should be used
```

#### How It Works

- **STRIPE mode** (default): Full Stripe integration, standard plans (FREE, STARTER, PRO)
- **UNLIMITED mode**: All workspaces get unlimited chats, no payment required
- **CUSTOM mode**: Reserved for custom billing logic (AI credits, etc.)

#### Existing Plan Support

The UNLIMITED plan was already present in the codebase:
- `/packages/billing/src/helpers/getChatsLimit.ts` - Returns "inf" for UNLIMITED
- `/packages/billing/src/helpers/getSeatsLimit.ts` - Returns "inf" for UNLIMITED

---

### Phase 3: Builder App Integration 🔄

**Date**: 2025-12-25
**Status**: In Progress

#### What Was Modified

1. **Builder Package Dependencies** (`/apps/builder/package.json`)
   - Added `@typebot.io/branding` as a workspace dependency

#### Next Steps for Phase 3

1. Update builder app's root layout to use branding
2. Replace logo in header/navigation
3. Update page metadata
4. Conditionally hide billing UI based on feature flags

---

## Implementation Details

### How to Use the Branding System

#### Basic Usage

```tsx
// Import branding
import { brandConfig, Logo, generatePageTitle } from '@typebot.io/branding'

// Use in components
export default function Page() {
  return (
    <div>
      <Logo size="header" />
      <h1>{brandConfig.tagline}</h1>
    </div>
  )
}

// Use in metadata
export const metadata = {
  title: generatePageTitle('Dashboard'),
  description: brandConfig.description,
}
```

#### Check Billing Mode

```tsx
import { isBillingEnabled, isUnlimitedBillingMode } from '@typebot.io/billing/helpers/isBillingEnabled'

export function BillingSection() {
  if (!isBillingEnabled()) {
    return null // Hide billing UI
  }

  if (isUnlimitedBillingMode()) {
    return <div>You have unlimited access</div>
  }

  return <SubscriptionPlans />
}
```

### Architecture Decisions

#### Why a Separate Branding Package?

1. **Separation of Concerns**: Branding logic separate from business logic
2. **Reusability**: Can be used across all apps (builder, viewer, landing, docs)
3. **Type Safety**: TypeScript ensures consistent usage
4. **Testing**: Easy to test branding logic in isolation
5. **Maintenance**: Single place to update brand configuration

#### Why Environment Variables?

1. **Multi-Client Support**: Each client gets their own .env file
2. **Security**: Sensitive data not in code
3. **Flexibility**: Change branding without code changes
4. **CI/CD Friendly**: Easy to configure different environments

---

## Next Steps

### Immediate (Phase 3 Completion)

- [ ] Update builder app layout with branding components
- [ ] Replace hardcoded "Typebot" text in builder UI
- [ ] Conditionally hide billing UI when `DISABLE_BILLING=true`
- [ ] Update i18n files to use template variables

### Short-term (Phase 5)

- [ ] Create automated rebranding script
- [ ] Document asset replacement process
- [ ] Create deployment guide
- [ ] Add examples for multi-client setup

### Medium-term (Future Enhancements)

- [ ] AI credits billing system (per user request: skipped for now)
- [ ] Admin dashboard for white-label management
- [ ] Automated testing for white-label configurations

---

## Testing Instructions

### Test Branding Package

```bash
# 1. Install dependencies
bun install

# 2. Set environment variables
export BRAND_NAME="TestBrand"
export BRAND_DISPLAY_NAME="Test Brand"
export BRAND_PRIMARY_COLOR="#0066CC"

# 3. Test in builder app
cd apps/builder
bun dev

# 4. Verify branding config is loaded
# In browser console:
# > import { brandConfig } from '@typebot.io/branding'
# > console.log(brandConfig)
```

### Test Billing Feature Flags

```bash
# 1. Disable billing
export DISABLE_BILLING=true
export BILLING_MODE=UNLIMITED

# 2. Start builder
cd apps/builder
bun dev

# 3. Check workspace plan
# Should default to UNLIMITED
# Billing UI should be hidden
```

### Test White-Label Mode

```bash
# 1. Set white-label environment
export BRAND_NAME="ClientCorp"
export BRAND_DISPLAY_NAME="ClientCorp Chatbot"
export BRAND_PRIMARY_COLOR="#FF0000"
export SHOW_TYPEBOT_BRANDING=false
export NEXT_PUBLIC_BUILDER_URL=https://app.clientcorp.com

# 2. Build and run
bun install
bun build
bun start

# 3. Verify
# - No "Typebot" references visible
# - Custom brand name shown
# - Custom colors applied
# - Custom domain in URLs
```

---

## Known Issues & Limitations

### Current Limitations

1. **i18n Files Not Updated**: Translation files still contain hardcoded "Typebot" references
   - **Location**: `/apps/builder/src/i18n/*.json`
   - **Impact**: Some UI text will still show "Typebot"
   - **Fix**: Update translation files or use template variables

2. **Visual Assets Not Replaced**: Logo files need manual replacement
   - **Location**: `/apps/builder/public/*`, `/apps/landing-page/public/*`
   - **Impact**: Original Typebot logos still displayed
   - **Fix**: Replace image files with custom logos

3. **Docker Images**: Container image names still reference Typebot
   - **Location**: `docker-compose.yml`, Dockerfiles
   - **Impact**: Image names need updating for production
   - **Fix**: Rename Docker images in deployment scripts

4. **Documentation Site**: Docs app not yet updated
   - **Location**: `/apps/docs/`
   - **Impact**: Documentation still shows Typebot branding
   - **Fix**: Update Mintlify config and content

### Breaking Changes

None so far. All changes are backward-compatible:
- Default values maintain current behavior
- New environment variables are optional
- Existing code continues to work without changes

---

## Migration Guide for Existing Deployments

### Step 1: Update Dependencies

```bash
bun install
```

### Step 2: Add Environment Variables

Add to your `.env` file:

```bash
# Minimal configuration (uses defaults)
BRAND_NAME=Typebot
BRAND_DISPLAY_NAME=Typebot

# Or full white-label configuration
BRAND_NAME=YourBrand
BRAND_DISPLAY_NAME="Your Brand"
BRAND_PRIMARY_COLOR=#0066CC
NEXT_PUBLIC_BUILDER_URL=https://app.yourbrand.com
NEXT_PUBLIC_VIEWER_URL=https://chat.yourbrand.com
DISABLE_BILLING=true
BILLING_MODE=UNLIMITED
```

### Step 3: Replace Visual Assets (Optional)

Replace logo files in:
- `/apps/builder/public/images/logo.png`
- `/apps/builder/public/favicon.svg`
- `/apps/landing-page/public/images/favicon.svg`

### Step 4: Update Code (Optional)

Replace hardcoded brand references with branding package:

```tsx
// Before
<img src="/images/logo.png" alt="Typebot" />

// After
import { Logo } from '@typebot.io/branding'
<Logo size="header" />
```

### Step 5: Rebuild and Deploy

```bash
bun build
bun start
```

---

## Code Samples

### Example 1: Custom Landing Page

```tsx
import {
  brandConfig,
  Logo,
  BrandedFooter,
  generateOpenGraphTags
} from '@typebot.io/branding'

export const metadata = {
  title: brandConfig.displayName,
  description: brandConfig.tagline,
  ...generateOpenGraphTags({
    title: brandConfig.displayName,
    description: brandConfig.tagline,
    url: brandConfig.domains.landing,
  }),
}

export default function LandingPage() {
  return (
    <>
      <header>
        <Logo size="header" />
        <nav>{/* Navigation */}</nav>
      </header>

      <main>
        <h1>{brandConfig.tagline}</h1>
        <p>{brandConfig.description}</p>
      </main>

      <BrandedFooter
        showLogo
        showSocial
        customLinks={[
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
        ]}
      />
    </>
  )
}
```

### Example 2: Conditional Billing UI

```tsx
import { isBillingEnabled } from '@typebot.io/billing/helpers/isBillingEnabled'
import { env } from '@typebot.io/env'

export function WorkspaceSettings() {
  const showBilling = isBillingEnabled()

  return (
    <div>
      <h1>Workspace Settings</h1>

      {showBilling ? (
        <section>
          <h2>Subscription</h2>
          <SubscriptionPlans />
          <BillingHistory />
        </section>
      ) : (
        <section>
          <h2>Usage</h2>
          <p>You have unlimited access</p>
        </section>
      )}
    </div>
  )
}
```

### Example 3: Email Template

```tsx
import { Logo, brandConfig, COPYRIGHT_YEAR_RANGE } from '@typebot.io/branding'

export function WelcomeEmail({ userName }: { userName: string }) {
  return (
    <div>
      <Logo size="email" />

      <h1>Welcome to {brandConfig.displayName}, {userName}!</h1>

      <p>{brandConfig.tagline}</p>

      <footer>
        <p>&copy; {COPYRIGHT_YEAR_RANGE} {brandConfig.company.legalName}</p>
        <p>
          Contact us: <a href={`mailto:${brandConfig.company.supportEmail}`}>
            {brandConfig.company.supportEmail}
          </a>
        </p>
      </footer>
    </div>
  )
}
```

---

## Resources

### Documentation

- [Codebase Analysis](/docs/CODEBASE_ANALYSIS.md) - Complete analysis and strategy
- [Branding Package README](/packages/branding/README.md) - Detailed usage guide
- [Deployment Guide](/docs/DEPLOYMENT_GUIDE.md) - Coming soon

### Key Files

- `/packages/branding/src/config.ts` - Brand configuration
- `/packages/branding/src/components/Logo.tsx` - Logo component
- `/packages/env/src/index.ts` - Environment variables
- `/packages/billing/src/helpers/isBillingEnabled.ts` - Billing helpers

### External Links

- [Original Typebot Repo](https://github.com/baptisteArno/typebot.io)
- [License: FSL-1.1-Apache-2.0](https://github.com/baptisteArno/typebot.io/blob/main/LICENSE)

---

## Changelog

### 2025-12-25

#### Added
- ✅ Created `/packages/branding` package with complete branding system
- ✅ Added environment variables for brand configuration
- ✅ Created reusable Logo and Footer components
- ✅ Added helper utilities for branding operations
- ✅ Added billing feature flags to environment package
- ✅ Created billing mode helper functions
- ✅ Integrated branding package into builder app dependencies

#### Modified
- ✅ `/packages/env/src/index.ts` - Added billing configuration
- ✅ `/apps/builder/package.json` - Added branding dependency

#### Documentation
- ✅ Created comprehensive codebase analysis
- ✅ Created implementation log (this document)
- ✅ Created branding package README

---

**Last Updated**: 2025-12-25
**Version**: 1.0.0
**Status**: Phase 3 In Progress
