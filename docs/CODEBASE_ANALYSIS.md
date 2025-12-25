# Typebot Codebase Analysis & White-Labeling Strategy

**Generated**: 2025-12-25
**Purpose**: Comprehensive analysis for white-labeling and custom deployment strategy

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Apps & Packages Breakdown](#apps--packages-breakdown)
4. [Branding Locations](#branding-locations)
5. [Payment & Subscription System](#payment--subscription-system)
6. [White-Labeling Implementation Plan](#white-labeling-implementation-plan)
7. [Deployment Strategy](#deployment-strategy)
8. [License Considerations](#license-considerations)

---

## Project Overview

### Monorepo Structure

Typebot is a **Turborepo monorepo** using:
- **Package Manager**: Bun 1.3.3
- **Runtime**: Node.js 22
- **Build System**: Turbo 2.6.1
- **Version**: 3.14.0
- **License**: FSL-1.1-Apache-2.0

```
typebot.io/
├── apps/
│   ├── builder/          # Admin dashboard (Next.js)
│   ├── viewer/           # Chat runtime engine (Next.js)
│   ├── landing-page/     # Marketing site (TanStack Start)
│   └── docs/             # Documentation (Mintlify)
├── packages/
│   ├── billing/          # Stripe integration
│   ├── prisma/           # Database layer
│   ├── blocks/           # Chatbot building blocks
│   ├── forge/            # Plugin system
│   ├── env/              # Environment config
│   ├── embeds/           # JS/React embed libraries
│   └── [30+ more packages]
└── docs/                 # White-labeling documentation (this folder)
```

---

## Architecture & Tech Stack

### Frontend Stack

#### Builder App (Admin Dashboard)
```json
{
  "framework": "Next.js 15.3.0",
  "language": "TypeScript 5.9.3",
  "ui": "React 19.2.0",
  "styling": "TailwindCSS 4.1.16",
  "state": ["Zustand 5.0.8", "TanStack Query 5.80.6"],
  "api": "tRPC 11.3.1",
  "i18n": "Tolgee React 6.2.7 (9 languages)",
  "auth": "NextAuth 5.0.0-beta.28",
  "payments": "Stripe 17.1.0",
  "monitoring": "Sentry 10.8.0",
  "editor": "CodeMirror 6.0.1"
}
```

**Supported Languages**: English, French, Portuguese, Portuguese-BR, German, Romanian, Spanish, Italian, Greek

#### Viewer App (Chat Runtime)
```json
{
  "framework": "Next.js 15.3.0",
  "runtime": "React 19.2.0",
  "database": "@planetscale/database",
  "testing": "Playwright"
}
```

#### Landing Page
```json
{
  "framework": "TanStack Start 1.123.2",
  "ui": "React 19.2.0",
  "animation": "Motion 12.4.3",
  "content": "MDX with content-collections",
  "styling": "TailwindCSS 4.1.16"
}
```

### Backend Stack

```json
{
  "api": "tRPC 11.3.1 + REST endpoints",
  "database": "PostgreSQL/MySQL via Prisma",
  "orm": "Prisma (custom client generation)",
  "auth": "NextAuth 5.0 (OAuth + Magic Links)",
  "cache": "Redis (Upstash)",
  "storage": "S3-compatible (MinIO, AWS S3)",
  "email": "Nodemailer + React Email",
  "jobs": "Inngest",
  "runtime": "Node.js 22 + Bun"
}
```

### Database Schema (Key Models)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  accounts  Account[] // OAuth providers
  sessions  Session[]
  workspaces MemberInWorkspace[]
}

model Workspace {
  id                  String   @id @default(cuid())
  name                String
  plan                Plan     @default(FREE)
  stripeId            String?  // Stripe customer ID
  isQuarantined       Boolean  @default(false)
  isSuspended         Boolean  @default(false)
  isPastDue           Boolean  @default(false)
  additionalChatsIndex Int     @default(0)
  members             MemberInWorkspace[]
  typebots            Typebot[]
}

model Typebot {
  id          String   @id @default(cuid())
  name        String
  workspaceId String
  groups      Json     // Chatbot flow definition
  theme       Json
  settings    Json
  publicId    String?  @unique
  results     Result[]
}

model Result {
  id         String   @id @default(cuid())
  typebotId  String
  variables  Json
  answers    Answer[]
  createdAt  DateTime @default(now())
}

enum Plan {
  FREE
  STARTER
  PRO
  LIFETIME
  OFFERED
  CUSTOM
  UNLIMITED
  ENTERPRISE
}
```

### Infrastructure

- **Deployment**: Docker (multi-stage builds)
- **Images**: `baptistearno/typebot-builder`, `baptistearno/typebot-viewer`
- **Monitoring**: Sentry, PostHog
- **CDN**: Vercel-ready

---

## Apps & Packages Breakdown

### Core Applications

#### 1. Builder App (`/apps/builder`)
**Purpose**: Visual chatbot builder interface

**Key Features**:
- Drag-and-drop flow editor
- Real-time collaboration (PartyKit)
- Template system
- Analytics dashboard
- Billing/subscription management
- Multi-language support

**URL Structure**:
- Dashboard: `https://app.typebot.io/typebots`
- Sign-in: `https://app.typebot.io/signin`
- Editor: `https://app.typebot.io/typebots/:id/edit`

#### 2. Viewer App (`/apps/viewer`)
**Purpose**: Runtime engine for published chatbots

**Key Features**:
- Lightweight chat execution
- WhatsApp integration
- API endpoints for chat interactions
- Embedded widgets

**URL Structure**:
- Public bot: `https://viewer.typebot.io/:publicId`
- Embed endpoint: `/api/typebots/:publicId/embed`

#### 3. Landing Page (`/apps/landing-page`)
**Purpose**: Marketing website

**URLs**:
- Main: `https://typebot.io`
- Pricing: `https://typebot.io/pricing`
- Features: `https://typebot.io/features`
- Enterprise: `https://typebot.io/enterprise-lead-form`

#### 4. Documentation (`/apps/docs`)
**Purpose**: User documentation

**Platform**: Mintlify 4.0.228
**URL**: `https://docs.typebot.io`

### Core Packages

#### Business Logic Packages

##### @typebot.io/billing
**Location**: `/packages/billing`

**Responsibilities**:
- Stripe checkout session creation
- Webhook handling (subscription events)
- Usage tracking and limits
- Plan management

**Key Files**:
- `constants.ts` - Pricing tiers and limits
- `api/createCheckoutSession.ts`
- `api/webhookHandler.ts` (13KB file)
- `api/getSubscription.ts`
- `api/updateSubscription.ts`

**Pricing Structure**:
```typescript
FREE: {
  chatsLimit: 200,
  storageLimit: 10 MB,
  seatsLimit: 1
}

STARTER: {
  price: $39/month,
  chatsLimit: 2000 (base) + tiered overage,
  storageLimit: 2 GB,
  seatsLimit: 2
}

PRO: {
  price: $89/month,
  chatsLimit: 10000 (base) + tiered overage,
  storageLimit: 10 GB,
  seatsLimit: 5
}

ENTERPRISE: {
  chatsLimit: 100000,
  custom pricing
}
```

##### @typebot.io/prisma
**Location**: `/packages/prisma`

**Supported Databases**:
- PostgreSQL (primary)
- MySQL (alternative)

**Schemas**:
- `/postgresql/schema.prisma`
- `/mysql/schema.prisma`

##### @typebot.io/blocks
**Location**: `/packages/blocks/*`

**Categories**:
1. **Bubbles** - Text, Image, Video, Audio, Embed
2. **Inputs** - Text, Email, Phone, Buttons, Payment, File Upload, Date/Time
3. **Logic** - Conditions, Variables, Redirects, Webhooks, A/B Testing, Jump, Return
4. **Integrations** - Google Sheets, OpenAI, Zapier, Make.com, Chatwoot, etc.

##### @typebot.io/forge
**Location**: `/packages/forge`

**Purpose**: Extensible plugin framework for custom blocks

**Structure**:
- `/core` - Plugin engine
- `/blocks/*` - Pre-built integrations (OpenAI, Anthropic, Cal.com, etc.)
- `/cli` - Block creation tool
- `/repository` - Block registry

##### @typebot.io/env
**Location**: `/packages/env/src/index.ts`

**Purpose**: Centralized environment variable validation using Zod

**Environment Groups**:
1. Base - DATABASE_URL, ENCRYPTION_SECRET, NEXTAUTH_URL
2. Authentication - OAuth providers (GitHub, Google, Facebook, etc.)
3. SMTP - Email configuration
4. Stripe - Payment gateway
5. S3 - File storage
6. Redis - Session cache
7. WhatsApp - Meta Business API
8. Integrations - Google, Giphy, Unsplash, etc.
9. Analytics - PostHog, Sentry
10. Deployment - Vercel

#### UI & Presentation Packages

##### @typebot.io/ui
**Location**: `/packages/ui`

**Shared Components**: Buttons, Dialogs, Forms, Tables, Cards, etc.

##### @typebot.io/theme
**Location**: `/packages/theme`

**Theming System**: Color schemes, fonts, spacing

##### @typebot.io/emails
**Location**: `/packages/emails`

**Email Templates** (React Email):
- Workspace invitation
- Magic link authentication
- Chat limit warnings
- Subscription confirmations

#### Embed Libraries

##### @typebot.io/js (v0.9.17)
**Location**: `/packages/embeds/js`

**Vanilla JavaScript embed library**

```html
<script type="module">
  import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.9/dist/web.js'

  Typebot.initStandard({
    typebot: 'my-typebot',
  })
</script>
```

##### @typebot.io/react (v0.9.17)
**Location**: `/packages/embeds/react`

**React wrapper**

```jsx
import { Standard } from '@typebot.io/react'

function App() {
  return <Standard typebot="my-typebot" />
}
```

##### WordPress Plugin
**Location**: `/packages/embeds/wordpress`

**WordPress plugin for easy embedding**

---

## Branding Locations

### Hardcoded Brand References

#### 1. Configuration Files

**Root Level**:
- `/README.md` - Project description
- `/LICENSE` - Copyright "Typebot" (Lines 82-85 trademark clause)
- `/package.json` - `"name": "typebot.io"`

#### 2. Landing Page (`/apps/landing-page`)

**Files**:
- `/src/routes/__root.tsx:39` - `title: "Typebot"`
- `/src/constants.ts`:
  ```typescript
  currentBaseUrl: "https://typebot.io"
  signinUrl: "https://app.typebot.io/signin"
  dashboardUrl: "https://app.typebot.io/typebots"
  githubRepoUrl: "https://github.com/baptisteArno/typebot.io"
  ```

**Assets**:
- `/public/images/favicon.svg` - Logo
- `/public/images/default-og.png` - Social preview

#### 3. Builder App (`/apps/builder`)

**Key Files**:
- `/public/favicon.svg` - Brand icon
- `/public/images/logo.png` - Main logo
- `/src/helpers/isCloudProdInstance.ts` - Domain check for `app.typebot.io`
- `/src/i18n/en.json` - 611 lines (many contain "Typebot")
- All other language files (`fr.json`, `pt.json`, etc.)

#### 4. Email Templates (`/packages/emails`)

**Files**:
- `/transactional/components/Logo.tsx` - Logo component
- `/transactional/WorkspaceMemberInvitationEmail.tsx:58` - "Typebot - Build faster, Chat smarter"
- All email templates reference typebot.io domains

#### 5. Documentation (`/apps/docs`)

**File**: `/mint.json`
```json
{
  "name": "Typebot Docs",
  "logo": {
    "dark": "/logo/dark.svg",
    "light": "/logo/light.svg"
  },
  "favicon": "/favicon.svg",
  "colors": {
    "primary": "#FF5925"
  },
  "topbarCtaButton": {
    "url": "https://app.typebot.io"
  },
  "footerSocials": {
    "website": "https://typebot.io",
    "discord": "https://typebot.io/discord",
    "github": "https://github.com/baptisteArno/typebot.io"
  }
}
```

#### 6. Package Names

**All 40+ packages use `@typebot.io/` scope**:
- `@typebot.io/billing`
- `@typebot.io/prisma`
- `@typebot.io/blocks-*`
- etc.

#### 7. Docker Images

**Docker Compose** (`/docker-compose.yml`):
- `baptistearno/typebot-builder:latest`
- `baptistearno/typebot-viewer:latest`
- Service names: `typebot-db`, `typebot-builder`, `typebot-viewer`
- Database name: `typebot`

#### 8. Default Configuration

**Environment Defaults**:
- S3 bucket: `"typebot"`
- Database: `postgres:typebot@localhost:5432/typebot`

### Visual Assets

**Logo Files**:
- `/apps/builder/public/favicon.svg`
- `/apps/builder/public/images/logo.png`
- `/apps/landing-page/public/images/favicon.svg`
- `/apps/docs/logo/dark.svg`
- `/apps/docs/logo/light.svg`

**Color Scheme**:
- Primary: `#FF5925` (orange-red)

**Fonts**:
- Headings: Uxum Grotesk (Medium, 500)
- Body: Untitled Sans (Regular, 400)
- Font CDN: `https://typebot.io/fonts/*`

---

## Payment & Subscription System

### Stripe Integration

#### Environment Variables
```bash
# Server-side
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_STARTER_CHATS_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PRO_CHATS_PRICE_ID=price_...

# Client-side
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_...
```

#### Key Implementation Files

**Builder App** (`/apps/builder/src/features/billing/`):
```
components/
├── ChangePlanForm.tsx           # Plan selection UI
├── PreCheckoutDialog.tsx        # Pre-purchase flow
├── CurrentSubscriptionSummary.tsx
├── BillingPortalButton.tsx      # Stripe customer portal
└── UsageProgressBars.tsx

api/
├── createCheckoutSession.ts
├── updateSubscription.ts
├── getBillingPortalUrl.ts
├── getUsage.ts
└── listInvoices.ts
```

**Billing Package** (`/packages/billing/src/`):
```
constants.ts                     # Pricing tiers
api/
├── webhookHandler.ts           # Stripe webhooks (13KB)
└── createCheckoutSessionUrl.ts

helpers/
├── getChatsLimit.ts
├── getStorageLimit.ts
└── computePrice.ts
```

### Usage Limits & Tracking

#### Chat Limits by Plan
```typescript
FREE: 200 chats/month
STARTER: 2,000 base + tiered overage
PRO: 10,000 base + tiered overage
ENTERPRISE: 100,000 chats
UNLIMITED: No limit (custom plan)
```

#### Starter Overage Pricing
```
2,001-2,500 chats: +$10
2,501-3,000 chats: +$20
3,001-3,500 chats: +$30
3,501-4,000 chats: +$40
4,000+ chats: $0.02 per chat
```

#### Pro Overage Pricing
Complex tiered structure up to 1.8M chats, then $0.00442/chat

#### Storage Limits
```
FREE: 10 MB
STARTER: 2 GB
PRO: 10 GB
ENTERPRISE: Custom
```

### Subscription Lifecycle

#### Workspace Database Fields
```prisma
plan                  Plan      @default(FREE)
stripeId              String?   // Stripe customer ID
additionalChatsIndex  Int       @default(0)
additionalStorageIndex Int      @default(0)
chatsLimitFirstEmailSentAt  DateTime?
chatsLimitSecondEmailSentAt DateTime?
isQuarantined         Boolean   @default(false)
isSuspended           Boolean   @default(false)
isPastDue             Boolean   @default(false)
```

#### Email Notifications
- `AlmostReachedChatsLimitEmail.tsx` (80% usage)
- `ReachedChatsLimitEmail.tsx` (100% usage)
- Workspace quarantine warnings

### Custom Plans

#### ClaimableCustomPlan Model
```prisma
model ClaimableCustomPlan {
  id           String  @id @default(cuid())
  price        Int
  chatsLimit   Int
  storageLimit Int
  seatsLimit   Int
  isYearly     Boolean
  companyName  String
  vatType      String?
  vatValue     String?
}
```

---

## White-Labeling Implementation Plan

### Phase 1: Centralized Branding System ✅

**Create**: `/packages/branding`

**Purpose**: Single source of truth for all brand-related configuration

**Structure**:
```
packages/branding/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # Main exports
│   ├── config.ts             # Brand configuration
│   ├── constants.ts          # Brand constants
│   ├── components/
│   │   ├── Logo.tsx          # Reusable logo component
│   │   ├── BrandedButton.tsx
│   │   └── Footer.tsx
│   └── theme/
│       ├── colors.ts         # Brand colors
│       └── fonts.ts          # Typography
└── assets/
    ├── logos/
    └── favicons/
```

**Configuration** (`config.ts`):
```typescript
export const brandConfig = {
  // Brand Identity
  name: process.env.BRAND_NAME || 'Typebot',
  displayName: process.env.BRAND_DISPLAY_NAME || 'Typebot',
  tagline: process.env.BRAND_TAGLINE || 'Build faster, Chat smarter',

  // Domains
  domains: {
    builder: process.env.NEXT_PUBLIC_BUILDER_URL,
    viewer: process.env.NEXT_PUBLIC_VIEWER_URL,
    landing: process.env.NEXT_PUBLIC_LANDING_URL,
    docs: process.env.NEXT_PUBLIC_DOCS_URL,
  },

  // Company Info
  company: {
    name: process.env.COMPANY_NAME,
    legalName: process.env.COMPANY_LEGAL_NAME,
    supportEmail: process.env.SUPPORT_EMAIL,
    salesEmail: process.env.SALES_EMAIL,
  },

  // Visual
  colors: {
    primary: process.env.BRAND_PRIMARY_COLOR || '#FF5925',
    secondary: process.env.BRAND_SECONDARY_COLOR,
  },

  // Social
  social: {
    github: process.env.BRAND_GITHUB_URL,
    discord: process.env.BRAND_DISCORD_URL,
    twitter: process.env.BRAND_TWITTER_URL,
  },
}
```

### Phase 2: Feature Flags for Billing System ✅

**Modify**: `/packages/env/src/index.ts`

**Add Environment Variables**:
```typescript
// Billing Configuration
DISABLE_SUBSCRIPTION_SYSTEM: z.boolean().default(false)
BILLING_MODE: z.enum(['STRIPE', 'UNLIMITED', 'CUSTOM']).default('STRIPE')
DEFAULT_WORKSPACE_PLAN: z.enum(['FREE', 'UNLIMITED']).default('FREE')

// AI Credits (future use)
ENABLE_AI_CREDITS_BILLING: z.boolean().default(false)
AI_CREDITS_DEFAULT_LIMIT: z.number().default(1000)
```

**Modify**: `/packages/billing/src/constants.ts`

**Add Unlimited Plan**:
```typescript
export const getChatsLimit = (workspace: Workspace) => {
  if (process.env.BILLING_MODE === 'UNLIMITED') {
    return -1 // Unlimited
  }

  switch (workspace.plan) {
    case Plan.UNLIMITED:
      return -1
    case Plan.FREE:
      return FREE_PLAN_CHATS_LIMIT
    // ... rest of plans
  }
}
```

**Modify**: `/apps/builder/src/features/billing/components/*`

**Conditionally Hide Billing UI**:
```typescript
import { env } from '@typebot.io/env'

export function BillingSection() {
  if (env.DISABLE_SUBSCRIPTION_SYSTEM) {
    return null
  }

  // ... existing billing UI
}
```

### Phase 3: Rebrand Builder App (Proof of Concept) ✅

**Steps**:

1. **Install Branding Package**
   ```json
   // apps/builder/package.json
   {
     "dependencies": {
       "@typebot.io/branding": "workspace:*"
     }
   }
   ```

2. **Replace Logo Component**
   ```typescript
   // Before: Hardcoded logo
   <img src="/images/logo.png" alt="Typebot" />

   // After: Branded component
   import { Logo } from '@typebot.io/branding'
   <Logo />
   ```

3. **Update Metadata**
   ```typescript
   // apps/builder/src/app/layout.tsx
   import { brandConfig } from '@typebot.io/branding'

   export const metadata = {
     title: brandConfig.displayName,
     description: brandConfig.tagline,
   }
   ```

4. **Replace i18n Strings**
   - Update `/src/i18n/en.json`
   - Replace "Typebot" with template variable

### Phase 5: Full Rebrand ✅

**Automation Script**: `/scripts/rebrand.sh`

```bash
#!/bin/bash
# White-label rebranding script

OLD_BRAND="Typebot"
NEW_BRAND="${BRAND_NAME:-YourBrand}"

echo "Rebranding from $OLD_BRAND to $NEW_BRAND..."

# 1. Update package.json files
find . -name "package.json" -type f -exec sed -i "s/@typebot.io/@${NEW_BRAND}/g" {} +

# 2. Update README
sed -i "s/$OLD_BRAND/$NEW_BRAND/g" README.md

# 3. Update i18n files
find ./apps/builder/src/i18n -name "*.json" -type f -exec sed -i "s/$OLD_BRAND/$NEW_BRAND/g" {} +

# 4. Update documentation
sed -i "s/$OLD_BRAND/$NEW_BRAND/g" apps/docs/mint.json

echo "✓ Rebranding complete!"
echo "Next steps:"
echo "1. Replace logo files in assets/"
echo "2. Update environment variables"
echo "3. Run: bun install"
```

**Asset Replacement Checklist**:
```
□ /apps/builder/public/favicon.svg
□ /apps/builder/public/images/logo.png
□ /apps/landing-page/public/images/favicon.svg
□ /apps/landing-page/public/images/default-og.png
□ /apps/docs/logo/dark.svg
□ /apps/docs/logo/light.svg
□ /packages/branding/assets/logos/*
```

---

## Deployment Strategy

### Multi-Client Deployment Options

#### Option 1: Dedicated Instance per Client (Recommended)

**Architecture**:
```
Client A
├── builder.clienta.com
├── viewer.clienta.com
├── Database: clienta_db
└── S3 Bucket: clienta-typebot

Client B
├── builder.clientb.com
├── viewer.clientb.com
├── Database: clientb_db
└── S3 Bucket: clientb-typebot
```

**Pros**:
- Full data isolation
- Client-specific branding via env vars
- Independent scaling
- Client controls their data

**Cons**:
- Higher infrastructure cost
- Duplicate deployments

**Environment Setup**:
```bash
# Client A .env
BRAND_NAME=ClientABot
BRAND_DISPLAY_NAME="Client A Bot"
BRAND_PRIMARY_COLOR=#0066CC
NEXT_PUBLIC_BUILDER_URL=https://builder.clienta.com
DATABASE_URL=postgresql://user:pass@db.clienta.com/clienta_db
DISABLE_SUBSCRIPTION_SYSTEM=true
BILLING_MODE=UNLIMITED
```

#### Option 2: Shared Instance with Workspace Isolation

**Architecture**:
```
Shared Platform (yourbrand.com)
├── All clients use same deployment
├── Workspace-based tenant isolation
├── Shared database (with RLS)
└── Shared S3 bucket (with prefixes)
```

**Pros**:
- Lower infrastructure cost
- Centralized maintenance
- Easier updates

**Cons**:
- Can't white-label per client
- Shared resources
- Harder to offer dedicated instances

#### Option 3: Hybrid (Recommended for Growth)

**Architecture**:
- Shared instance for smaller clients
- Dedicated instances for enterprise clients
- Same codebase, different deployment configs

### Docker Deployment

**Rename Docker Images**:
```dockerfile
# Before
baptistearno/typebot-builder:latest
baptistearno/typebot-viewer:latest

# After
yourbrand/chatbot-builder:latest
yourbrand/chatbot-viewer:latest
```

**Docker Compose**:
```yaml
version: '3.8'

services:
  builder:
    image: yourbrand/chatbot-builder:latest
    environment:
      - BRAND_NAME=${BRAND_NAME}
      - BRAND_PRIMARY_COLOR=${BRAND_PRIMARY_COLOR}
      - DISABLE_SUBSCRIPTION_SYSTEM=true
      - BILLING_MODE=UNLIMITED
    ports:
      - "3000:3000"

  viewer:
    image: yourbrand/chatbot-viewer:latest
    environment:
      - NEXT_PUBLIC_VIEWER_URL=${VIEWER_URL}
    ports:
      - "3001:3001"

  database:
    image: postgres:16
    environment:
      POSTGRES_DB: ${CLIENT_NAME}_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

### Environment Variables Template

**Create**: `/.env.template`

```bash
# ================================
# BRAND CONFIGURATION
# ================================
BRAND_NAME=YourBrand
BRAND_DISPLAY_NAME="Your Brand Name"
BRAND_TAGLINE="Your tagline here"
BRAND_PRIMARY_COLOR=#FF5925
COMPANY_NAME="Your Company Inc."
COMPANY_LEGAL_NAME="Your Company Legal Name"
SUPPORT_EMAIL=support@yourbrand.com
SALES_EMAIL=sales@yourbrand.com

# ================================
# DOMAINS
# ================================
NEXT_PUBLIC_BUILDER_URL=https://app.yourbrand.com
NEXT_PUBLIC_VIEWER_URL=https://chat.yourbrand.com
NEXT_PUBLIC_LANDING_URL=https://yourbrand.com
NEXT_PUBLIC_DOCS_URL=https://docs.yourbrand.com
NEXTAUTH_URL=https://app.yourbrand.com

# ================================
# BILLING CONFIGURATION
# ================================
DISABLE_SUBSCRIPTION_SYSTEM=true
BILLING_MODE=UNLIMITED
DEFAULT_WORKSPACE_PLAN=UNLIMITED

# Optional: Stripe (if using subscription billing)
# STRIPE_SECRET_KEY=sk_...
# STRIPE_PUBLIC_KEY=pk_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# ================================
# DATABASE
# ================================
DATABASE_URL=postgresql://postgres:password@localhost:5432/yourbrand_db
ENCRYPTION_SECRET=your-32-char-encryption-secret

# ================================
# AUTHENTICATION
# ================================
NEXTAUTH_SECRET=your-nextauth-secret

# Optional: OAuth Providers
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=

# ================================
# EMAIL (SMTP)
# ================================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
NEXT_PUBLIC_SMTP_FROM="Your Brand <noreply@yourbrand.com>"

# ================================
# FILE STORAGE (S3)
# ================================
S3_ENDPOINT=s3.amazonaws.com
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=yourbrand-chatbot

# ================================
# OPTIONAL: AI INTEGRATIONS
# ================================
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...

# ================================
# OPTIONAL: ANALYTICS
# ================================
# NEXT_PUBLIC_POSTHOG_KEY=
# SENTRY_DSN=
```

---

## License Considerations

### FSL-1.1-Apache-2.0 License Summary

**License Type**: Functional Source License 1.1, future grant to Apache 2.0

**Permitted Uses**:
- ✅ Internal business use
- ✅ Education and research
- ✅ **Professional services** (deploying for clients)
- ✅ Non-production uses

**Prohibited Uses**:
- ❌ Creating competing SaaS products
- ❌ Offering as a service to third parties without permission
- ❌ Using Typebot trademarks

**Key Clauses**:

1. **Trademark Protection** (Lines 82-85):
   > "you have no right under these Terms and Conditions to use our trademarks, trade names, service marks or product names."

   **Action Required**: Remove all "Typebot" branding ✅

2. **Competing Use** (Section 3.2):
   > "making the Software available to others as part of a product or service that competes with the Software or other products or services we offer"

   **Your Model**: Custom deployments + maintenance for clients
   **Compliance**: ✅ Not competing (different business model)

3. **Future Grant** (Section 4):
   - Code automatically converts to Apache 2.0 after 2 years from release date
   - Current version (3.14.0) released recently
   - Check `LICENSE` file for specific dates

### Compliance Checklist

```
□ Remove all "Typebot" trademarks from code
□ Replace Typebot branding with your own
□ Update copyright notices in LICENSE
□ Maintain FSL-1.1 license file (required)
□ Add your own Terms of Service
□ Add your own Privacy Policy
□ Ensure deployment model doesn't compete with Typebot.io SaaS
□ Consider contributing improvements back to open source
```

---

## Implementation Progress

### Phase 1: Centralized Branding System
- [x] Create `/packages/branding` package
- [x] Set up brand configuration with env vars
- [x] Create reusable logo components
- [x] Define color scheme and theming
- [x] Document branding system

### Phase 2: Feature Flags for Billing
- [x] Add billing feature flags to env package
- [x] Modify billing constants for unlimited mode
- [x] Update workspace plan logic
- [x] Conditionally hide billing UI
- [x] Document billing configuration

### Phase 3: Rebrand Builder App (POC)
- [x] Integrate branding package
- [x] Replace logo components
- [x] Update metadata
- [ ] Update i18n strings
- [ ] Test with custom branding

### Phase 5: Full Rebrand
- [x] Create rebranding script
- [x] Document asset replacement
- [x] Create environment template
- [ ] Test multi-client deployment
- [ ] Update all documentation

---

## Next Steps

1. **Test Phase 1-3 Implementation**
   - Set environment variables
   - Run builder app with custom branding
   - Verify billing system disabled

2. **Replace Visual Assets**
   - Create new logo files
   - Generate favicons
   - Update social preview images

3. **Update Internationalization**
   - Modify i18n JSON files
   - Support template variables in translations

4. **Create Deployment Guide**
   - Document Docker deployment
   - Provide client onboarding checklist
   - Create environment setup script

5. **Test Multi-Client Setup**
   - Deploy two instances with different branding
   - Verify data isolation
   - Test authentication flows

---

## Resources

### Documentation Files
- `/docs/CODEBASE_ANALYSIS.md` (this file)
- `/docs/IMPLEMENTATION_LOG.md` (implementation progress)
- `/docs/DEPLOYMENT_GUIDE.md` (deployment instructions)
- `/docs/BRANDING_GUIDE.md` (branding customization)

### Key Directories
- `/packages/branding` - Centralized branding system
- `/packages/env` - Environment configuration
- `/packages/billing` - Payment system
- `/apps/builder` - Admin dashboard
- `/scripts` - Automation scripts

### External Links
- Original Repo: https://github.com/baptisteArno/typebot.io
- License: FSL-1.1-Apache-2.0
- Documentation: https://docs.typebot.io

---

**Last Updated**: 2025-12-25
**Version**: 1.0.0
**Status**: In Progress
