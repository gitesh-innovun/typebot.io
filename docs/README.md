# Typebot White-Labeling Documentation

Welcome to the white-labeling documentation for Typebot. This directory contains all the information you need to customize and deploy Typebot with your own branding.

## 📚 Documentation Overview

### Quick Start

**New to white-labeling?** Start here:
1. Read [Quick Start Guide](#quick-start-guide) below
2. Run the setup script: `./scripts/setup-white-label.sh`
3. Follow the [Deployment Guide](DEPLOYMENT_GUIDE.md)

### Documentation Files

| Document | Purpose | Read This If... |
|----------|---------|----------------|
| **[CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md)** | Comprehensive technical analysis | You want to understand the architecture and tech stack |
| **[IMPLEMENTATION_LOG.md](IMPLEMENTATION_LOG.md)** | Detailed implementation progress | You want to see what's been built and how it works |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | Step-by-step deployment instructions | You're ready to deploy a white-labeled instance |

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 22+ or Bun 1.3.3+
- PostgreSQL or MySQL database
- Basic understanding of environment variables

### 1. Run Setup Script

The easiest way to get started:

```bash
# Make the script executable (first time only)
chmod +x scripts/setup-white-label.sh

# Run the setup wizard
./scripts/setup-white-label.sh
```

This interactive script will:
- Create your `.env` configuration file
- Collect your brand information
- Generate secure secrets
- Configure billing settings

### 2. Replace Visual Assets

Replace these logo files with your own:

```bash
# Builder App
apps/builder/public/favicon.svg
apps/builder/public/images/logo.png

# Landing Page
apps/landing-page/public/images/favicon.svg
apps/landing-page/public/images/og-image.png

# Documentation
apps/docs/logo/dark.svg
apps/docs/logo/light.svg
```

### 3. Install and Run

```bash
# Install dependencies
bun install

# Development mode
bun run dev

# Production build
bun run build
bun start
```

### 4. Access Your Instance

- Builder (admin dashboard): http://localhost:3000
- Viewer (chat runtime): http://localhost:3001

---

## 🎨 White-Labeling Features

### What You Can Customize

#### ✅ Brand Identity
- Company name and display name
- Tagline and description
- Logo and favicons
- Color scheme (primary, secondary, accent)
- Social media links

#### ✅ Domains
- Custom builder URL (e.g., `app.yourbrand.com`)
- Custom viewer URL (e.g., `chat.yourbrand.com`)
- Custom landing page URL
- Custom documentation URL

#### ✅ Billing System
- **Disable billing entirely** - Give users unlimited access
- **Unlimited mode** - No subscription required
- **Custom mode** - Implement your own billing (e.g., AI credits)
- **Stripe mode** - Use default subscription plans

#### ✅ Features
- Toggle Typebot branding visibility
- Toggle "Powered by" attribution
- Enable/disable marketplace
- Enable/disable community templates

---

## 📖 Key Concepts

### Centralized Branding System

All branding is managed through the `@typebot.io/branding` package:

```typescript
import { brandConfig, Logo } from '@typebot.io/branding'

// Access brand configuration
console.log(brandConfig.displayName) // "Your Brand"
console.log(brandConfig.colors.primary) // "#0066CC"

// Use branded components
<Logo size="header" />
```

### Environment-Based Configuration

Everything is controlled via environment variables:

```bash
# .env file
BRAND_NAME=YourBrand
BRAND_DISPLAY_NAME="Your Brand Name"
BRAND_PRIMARY_COLOR=#0066CC
DISABLE_BILLING=true
BILLING_MODE=UNLIMITED
```

No code changes required - just update your `.env` file!

### Billing Modes

Three billing modes are supported:

1. **STRIPE** (default): Full subscription system with Stripe
2. **UNLIMITED**: All users get unlimited access, no payments
3. **CUSTOM**: Reserved for custom billing logic (e.g., AI credits)

```bash
# Disable billing, give unlimited access
DISABLE_BILLING=true
BILLING_MODE=UNLIMITED
```

---

## 🏗️ Architecture Overview

### Monorepo Structure

```
typebot.io/
├── apps/
│   ├── builder/          # Admin dashboard (Next.js)
│   ├── viewer/           # Chat runtime (Next.js)
│   ├── landing-page/     # Marketing site
│   └── docs/             # Documentation
├── packages/
│   ├── branding/         # ⭐ White-labeling system
│   ├── billing/          # Payment & subscription logic
│   ├── env/              # Environment configuration
│   └── [30+ more...]
├── docs/                 # This directory
└── scripts/              # Helper scripts
```

### Tech Stack

- **Frontend**: React 19 + Next.js 15 + TailwindCSS 4
- **Backend**: Next.js API Routes + tRPC
- **Database**: PostgreSQL/MySQL via Prisma
- **Runtime**: Node.js 22 + Bun
- **Monorepo**: Turborepo
- **Auth**: NextAuth 5.0
- **Payment**: Stripe (optional)

---

## 🔧 Common Tasks

### Change Brand Name

```bash
# Edit .env
BRAND_NAME=NewBrand
BRAND_DISPLAY_NAME="New Brand Name"

# Rebuild
bun run build
```

### Change Colors

```bash
# Edit .env
BRAND_PRIMARY_COLOR=#FF0000
BRAND_SECONDARY_COLOR=#00FF00

# Restart dev server
bun run dev
```

### Disable Billing

```bash
# Edit .env
DISABLE_BILLING=true
BILLING_MODE=UNLIMITED

# Rebuild
bun run build
```

### Add Custom Domain

```bash
# Edit .env
NEXT_PUBLIC_BUILDER_URL=https://app.yourbrand.com
NEXT_PUBLIC_VIEWER_URL=https://chat.yourbrand.com

# Update DNS records to point to your server
# Configure reverse proxy (nginx/Caddy)
# Add SSL certificate
```

---

## 🚢 Deployment Scenarios

### Scenario 1: Single Client Deployment

Deploy one white-labeled instance for yourself or a single client.

**Best approach**: Manual deployment or Docker
**See**: [Deployment Guide - Option 1 or 2](DEPLOYMENT_GUIDE.md#deployment-options)

### Scenario 2: Multiple Clients (Separate Instances)

Deploy separate instances for different clients with different branding.

**Best approach**: Docker with different `.env` files
**See**: [Deployment Guide - Multi-Client](DEPLOYMENT_GUIDE.md#multi-client-deployment)

### Scenario 3: SaaS with Workspace Isolation

Single deployment, multiple clients using workspaces (less recommended for white-labeling).

**Best approach**: Not ideal for white-labeling
**Alternative**: Use Scenario 2 instead

---

## 📝 Implementation Status

### ✅ Completed (Ready to Use)

- [x] Centralized branding package (`@typebot.io/branding`)
- [x] Environment-based configuration
- [x] Logo components and utilities
- [x] Billing feature flags
- [x] UNLIMITED billing mode support
- [x] Documentation (this folder)
- [x] Setup wizard script

### 🔄 Partial Implementation

- [ ] Full builder app integration (components ready, needs integration)
- [ ] i18n files update (manual work required)
- [ ] Visual asset replacement (manual work required)

### ⏳ Future Enhancements

- [ ] AI credits billing system
- [ ] Automated i18n updates
- [ ] Admin dashboard for white-label management
- [ ] One-click asset replacement tool

---

## 🐛 Troubleshooting

### "Typebot" still appears in the UI

**Solution**:
1. Check `.env` has `BRAND_NAME` set
2. Rebuild: `bun run build`
3. Clear browser cache
4. Update i18n files manually (see [Implementation Log](IMPLEMENTATION_LOG.md#known-issues--limitations))

### Billing UI still shows

**Solution**:
```bash
# Ensure these are set in .env:
DISABLE_BILLING=true
BILLING_MODE=UNLIMITED

# Rebuild
bun run build
```

### Logo not displaying

**Solution**:
1. Check file exists: `ls apps/builder/public/images/logo.png`
2. Verify file permissions: `chmod 644 apps/builder/public/images/logo.png`
3. Clear browser cache

For more troubleshooting, see [Deployment Guide - Troubleshooting](DEPLOYMENT_GUIDE.md#troubleshooting)

---

## 📚 Additional Resources

### Internal Documentation

- [Branding Package README](/packages/branding/README.md)
- [Environment Package](/packages/env/src/index.ts)
- [Billing Helpers](/packages/billing/src/helpers/isBillingEnabled.ts)

### External Resources

- [Original Typebot Docs](https://docs.typebot.io)
- [Typebot GitHub](https://github.com/baptisteArno/typebot.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)

---

## 🤝 Contributing

### Reporting Issues

If you find issues with the white-labeling system:

1. Check the [Implementation Log](IMPLEMENTATION_LOG.md) for known issues
2. Search existing GitHub issues
3. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment details

### Suggesting Improvements

We welcome suggestions for:
- Better automation scripts
- Improved documentation
- Additional white-labeling features
- Deployment guides for specific platforms

---

## 📜 License

This white-labeling implementation follows the same license as Typebot:

**FSL-1.1-Apache-2.0** (Functional Source License)

Key points:
- ✅ You CAN use for professional services (deploying for clients)
- ✅ You MUST remove Typebot trademarks (handled by this system)
- ❌ You CANNOT create a competing SaaS product
- ℹ️ Automatically converts to Apache 2.0 after 2 years

See [Codebase Analysis - License](CODEBASE_ANALYSIS.md#license-considerations) for details.

---

## 📞 Support

### Documentation

Start here: [Deployment Guide](DEPLOYMENT_GUIDE.md)

### Community

- Original Typebot Discord: https://typebot.io/discord
- GitHub Discussions: https://github.com/baptisteArno/typebot.io/discussions

### Professional Services

For professional white-labeling services, deployment assistance, or custom development:
- Contact your deployment team
- Or engage with Typebot professional services

---

## 🗺️ Roadmap

### Short-term (Next Steps)

- [ ] Complete builder app integration
- [ ] Create automated i18n update script
- [ ] Add viewer app white-labeling
- [ ] Create landing page integration guide

### Medium-term

- [ ] AI credits billing system
- [ ] Multi-tenant white-label management
- [ ] Automated testing for white-label configs
- [ ] Additional theme customization options

### Long-term

- [ ] Visual brand editor (UI)
- [ ] One-click deployment scripts
- [ ] Marketplace for white-label themes
- [ ] Advanced customization API

---

**Last Updated**: 2025-12-25
**Version**: 1.0.0
**Status**: Production Ready (with manual asset replacement)

---

## Quick Links

- **[Start Here →](DEPLOYMENT_GUIDE.md#quick-start)** - 5-minute setup guide
- **[Technical Details →](CODEBASE_ANALYSIS.md)** - Deep dive into architecture
- **[Implementation Log →](IMPLEMENTATION_LOG.md)** - What's been built
- **[Setup Script →](/scripts/setup-white-label.sh)** - Automated configuration

---

Happy white-labeling! 🎨
