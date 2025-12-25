# White-Label Deployment Guide

**Last Updated**: 2025-12-25
**Version**: 1.0.0

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Deployment Options](#deployment-options)
4. [Configuration](#configuration)
5. [Asset Replacement](#asset-replacement)
6. [Testing](#testing)
7. [Production Checklist](#production-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 5-Minute White-Label Setup

```bash
# 1. Clone or use existing repository
cd /path/to/typebot.io

# 2. Copy environment template
cp .env.example .env

# 3. Configure branding (edit .env file)
nano .env

# Add these lines:
BRAND_NAME=YourBrand
BRAND_DISPLAY_NAME="Your Brand Name"
BRAND_PRIMARY_COLOR=#0066CC
NEXT_PUBLIC_BUILDER_URL=https://app.yourbrand.com
NEXT_PUBLIC_VIEWER_URL=https://chat.yourbrand.com
DISABLE_BILLING=true
BILLING_MODE=UNLIMITED

# 4. Install dependencies
bun install

# 5. Build and run
bun run build
bun start
```

That's it! Your white-labeled instance is running.

---

## Prerequisites

### System Requirements

- **Node.js**: v22 or higher
- **Bun**: v1.3.3 or higher (or npm/yarn/pnpm)
- **Database**: PostgreSQL 14+ or MySQL 8+
- **Storage**: S3-compatible storage (AWS S3, MinIO, etc.)
- **Memory**: Minimum 2GB RAM
- **Disk**: Minimum 5GB free space

### Tools Needed

```bash
# Install Bun (recommended)
curl -fsSL https://bun.sh/install | bash

# Or use Node.js/npm
node --version  # Should be v22+
npm --version
```

### Domain Setup

Before deploying, ensure you have:

1. **Builder Domain**: e.g., `app.yourbrand.com`
2. **Viewer Domain**: e.g., `chat.yourbrand.com`
3. **Landing Domain** (optional): e.g., `yourbrand.com`
4. **Docs Domain** (optional): e.g., `docs.yourbrand.com`

---

## Deployment Options

### Option 1: Docker (Recommended)

**Best for**: Production deployments, easy scaling

#### Step 1: Update Docker Compose

Edit `docker-compose.yml`:

```yaml
version: '3.8'

services:
  typebot-db:
    image: postgres:16
    restart: always
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=yourbrand_db
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_USER=postgres

  typebot-builder:
    image: baptistearno/typebot-builder:latest
    restart: always
    depends_on:
      - typebot-db
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@typebot-db:5432/yourbrand_db
      - ENCRYPTION_SECRET=${ENCRYPTION_SECRET}
      - NEXTAUTH_URL=${NEXT_PUBLIC_BUILDER_URL}
      - NEXT_PUBLIC_VIEWER_URL=${NEXT_PUBLIC_VIEWER_URL}

      # White-labeling
      - BRAND_NAME=${BRAND_NAME}
      - BRAND_DISPLAY_NAME=${BRAND_DISPLAY_NAME}
      - BRAND_PRIMARY_COLOR=${BRAND_PRIMARY_COLOR}
      - BRAND_TAGLINE=${BRAND_TAGLINE}
      - COMPANY_NAME=${COMPANY_NAME}
      - SUPPORT_EMAIL=${SUPPORT_EMAIL}

      # Billing
      - DISABLE_BILLING=true
      - BILLING_MODE=UNLIMITED

  typebot-viewer:
    image: baptistearno/typebot-viewer:latest
    restart: always
    depends_on:
      - typebot-db
    ports:
      - '3001:3001'
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@typebot-db:5432/yourbrand_db
      - NEXT_PUBLIC_VIEWER_URL=${NEXT_PUBLIC_VIEWER_URL}
      - ENCRYPTION_SECRET=${ENCRYPTION_SECRET}

volumes:
  db_data:
```

#### Step 2: Create .env file

```bash
# Database
DB_PASSWORD=your-secure-password

# Security
ENCRYPTION_SECRET=your-32-character-secret-key

# Domains
NEXT_PUBLIC_BUILDER_URL=https://app.yourbrand.com
NEXT_PUBLIC_VIEWER_URL=https://chat.yourbrand.com

# Branding
BRAND_NAME=YourBrand
BRAND_DISPLAY_NAME="Your Brand"
BRAND_PRIMARY_COLOR=#0066CC
BRAND_TAGLINE="Your awesome tagline"
COMPANY_NAME="Your Company Inc."
SUPPORT_EMAIL=support@yourbrand.com

# Billing (disabled)
DISABLE_BILLING=true
BILLING_MODE=UNLIMITED
```

#### Step 3: Deploy

```bash
# Start services
docker-compose up -d

# Check logs
docker-compose logs -f typebot-builder

# Access at:
# https://app.yourbrand.com (after DNS/proxy setup)
```

---

### Option 2: Manual Node.js Deployment

**Best for**: Development, VPS hosting

#### Step 1: Clone Repository

```bash
git clone https://github.com/baptisteArno/typebot.io.git yourbrand-chatbot
cd yourbrand-chatbot
```

#### Step 2: Configure Environment

```bash
cp .env.example .env
nano .env

# Add your configuration (see Configuration section)
```

#### Step 3: Install & Build

```bash
# Install dependencies
bun install

# Build all apps
bun run build

# Or build specific apps
cd apps/builder && bun run build
cd apps/viewer && bun run build
```

#### Step 4: Run

```bash
# Development
bun run dev

# Production
bun run start
```

---

### Option 3: Vercel Deployment

**Best for**: Serverless, auto-scaling

#### Step 1: Fork Repository

Fork the repository to your GitHub account

#### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Select your forked repository
4. Configure environment variables (see below)

#### Step 3: Environment Variables in Vercel

Add these in Vercel project settings → Environment Variables:

```
DATABASE_URL=<your-postgresql-url>
ENCRYPTION_SECRET=<32-char-secret>
NEXTAUTH_URL=https://app.yourbrand.com
NEXT_PUBLIC_VIEWER_URL=https://chat.yourbrand.com

# Branding
BRAND_NAME=YourBrand
BRAND_DISPLAY_NAME=Your Brand
BRAND_PRIMARY_COLOR=#0066CC
DISABLE_BILLING=true
BILLING_MODE=UNLIMITED

# Add all other required variables
```

#### Step 4: Deploy

Vercel will automatically deploy on push to main branch.

---

## Configuration

### Required Environment Variables

#### Core Configuration

```bash
# Database (PostgreSQL or MySQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Security - Generate with: openssl rand -base64 32
ENCRYPTION_SECRET=your-32-character-secret

# URLs
NEXTAUTH_URL=https://app.yourbrand.com
NEXT_PUBLIC_VIEWER_URL=https://chat.yourbrand.com
```

#### White-Labeling Configuration

```bash
# Brand Identity
BRAND_NAME=YourBrand
BRAND_DISPLAY_NAME="Your Brand Name"
BRAND_TAGLINE="Build powerful chatbots"
BRAND_DESCRIPTION="Your brand description here"

# Domains
NEXT_PUBLIC_BUILDER_URL=https://app.yourbrand.com
NEXT_PUBLIC_VIEWER_URL=https://chat.yourbrand.com
NEXT_PUBLIC_LANDING_URL=https://yourbrand.com
NEXT_PUBLIC_DOCS_URL=https://docs.yourbrand.com

# Company
COMPANY_NAME="Your Company Inc."
COMPANY_LEGAL_NAME="Your Company Legal Name"
SUPPORT_EMAIL=support@yourbrand.com
SALES_EMAIL=sales@yourbrand.com

# Colors (hex format)
BRAND_PRIMARY_COLOR=#0066CC
BRAND_SECONDARY_COLOR=#FF5925
BRAND_ACCENT_COLOR=#00CC66

# Feature Flags
SHOW_TYPEBOT_BRANDING=false
SHOW_POWERED_BY=false
ENABLE_MARKETPLACE=true
ENABLE_COMMUNITY_TEMPLATES=true

# Billing
DISABLE_BILLING=true
BILLING_MODE=UNLIMITED
```

### Optional Environment Variables

#### S3 File Storage

```bash
S3_ENDPOINT=s3.amazonaws.com
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=yourbrand-chatbot
S3_REGION=us-east-1
```

#### Email (SMTP)

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
NEXT_PUBLIC_SMTP_FROM=noreply@yourbrand.com
```

#### OAuth Providers

```bash
# Google
GOOGLE_AUTH_CLIENT_ID=your-client-id
GOOGLE_AUTH_CLIENT_SECRET=your-client-secret

# GitHub
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

---

## Asset Replacement

### Logo Files

Replace these files with your own branded assets:

#### Builder App

```bash
apps/builder/public/
├── favicon.svg              # Browser favicon (32x32)
├── favicon.ico              # Fallback favicon
├── apple-touch-icon.png     # iOS home screen (180x180)
└── images/
    ├── logo.png             # Main logo (150x40)
    ├── logo-light.svg       # Light theme logo
    └── logo-dark.svg        # Dark theme logo
```

#### Landing Page

```bash
apps/landing-page/public/
├── images/
│   ├── favicon.svg          # Favicon
│   ├── og-image.png         # Social media preview (1200x630)
│   └── twitter-card.png     # Twitter card (1200x600)
```

#### Documentation

```bash
apps/docs/
├── logo/
│   ├── dark.svg             # Dark mode logo
│   └── light.svg            # Light mode logo
└── favicon.svg              # Docs favicon
```

### Asset Guidelines

#### Logo Specifications

- **File formats**: SVG (preferred), PNG (fallback)
- **Header logo**: 120x32px (or proportional)
- **Email logo**: 150x40px
- **Footer logo**: 100x26px
- **Favicon**: 32x32px (SVG or ICO)
- **OG Image**: 1200x630px (PNG or JPG)

#### Color Specifications

- Use hex format: `#0066CC`
- Provide sufficient contrast for accessibility
- Test in both light and dark modes

---

## Testing

### Local Testing

```bash
# 1. Start development server
bun run dev

# 2. Test branding
# Open browser: http://localhost:3000
# Check:
# - Logo appears correctly
# - Brand name in title
# - Primary color applied
# - No "Typebot" references

# 3. Test billing disabled
# Navigate to: Settings → Billing
# Should show: "You have unlimited access"
# Should NOT show: Stripe checkout

# 4. Check browser console
# Should see no errors
# Verify brandConfig loaded:
import { brandConfig } from '@typebot.io/branding'
console.log(brandConfig)
```

### Production Testing

```bash
# 1. Build production version
bun run build

# 2. Run production server
bun start

# 3. Test with production URLs
curl https://app.yourbrand.com

# 4. Check SSL certificates
curl -I https://app.yourbrand.com | grep -i ssl

# 5. Test database connection
# Check builder logs for successful DB connection
```

---

## Production Checklist

### Pre-Deployment

- [ ] Update `.env` with production values
- [ ] Replace all logo/favicon files
- [ ] Set `NODE_ENV=production`
- [ ] Generate secure `ENCRYPTION_SECRET` (32 chars)
- [ ] Configure production database
- [ ] Set up S3 or file storage
- [ ] Configure SMTP for emails
- [ ] Set up SSL certificates
- [ ] Configure DNS records

### Security

- [ ] Change default passwords
- [ ] Use strong encryption secret
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Review database permissions
- [ ] Set up backups

### Branding

- [ ] Replace all visual assets
- [ ] Update brand colors
- [ ] Set company information
- [ ] Configure domain URLs
- [ ] Update email templates
- [ ] Test white-label mode
- [ ] Remove "Typebot" references

### Billing

- [ ] Set `BILLING_MODE=UNLIMITED` (or your mode)
- [ ] Verify no Stripe UI shows
- [ ] Test workspace creation
- [ ] Verify unlimited chats work
- [ ] Check usage tracking (if needed)

### Post-Deployment

- [ ] Test user registration
- [ ] Test chatbot creation
- [ ] Test chatbot publishing
- [ ] Test email delivery
- [ ] Test file uploads
- [ ] Monitor error logs
- [ ] Set up monitoring/alerts
- [ ] Create backups
- [ ] Document deployment

---

## Troubleshooting

### Common Issues

#### Issue: "Typebot" still appears in UI

**Cause**: i18n files not updated or branding not configured

**Fix**:
```bash
# 1. Check environment variables loaded
echo $BRAND_NAME

# 2. Rebuild after env changes
bun run build

# 3. Clear browser cache
# Ctrl+Shift+R (hard refresh)

# 4. Check i18n files
# May need manual update in apps/builder/src/i18n/*.json
```

#### Issue: Billing UI still shows

**Cause**: Environment variables not properly set

**Fix**:
```bash
# Ensure these are set:
export DISABLE_BILLING=true
export BILLING_MODE=UNLIMITED

# Rebuild
bun run build
```

#### Issue: Logo not displaying

**Cause**: File path incorrect or file not replaced

**Fix**:
```bash
# 1. Check file exists
ls apps/builder/public/images/logo.png

# 2. Check file permissions
chmod 644 apps/builder/public/images/logo.png

# 3. Verify path in brandConfig
# Should match BRAND_ASSETS constants
```

#### Issue: Database connection failed

**Cause**: Wrong DATABASE_URL format

**Fix**:
```bash
# PostgreSQL format:
DATABASE_URL=postgresql://user:password@host:5432/database

# MySQL format:
DATABASE_URL=mysql://user:password@host:3306/database

# Test connection:
psql $DATABASE_URL -c "SELECT 1"
```

#### Issue: Build fails

**Cause**: Missing dependencies or incompatible Node version

**Fix**:
```bash
# 1. Check Node version
node --version  # Should be v22+

# 2. Clear cache and reinstall
rm -rf node_modules
rm bun.lockb
bun install

# 3. Check for TypeScript errors
bun run lint
```

### Debug Mode

Enable debug logging:

```bash
# Add to .env
DEBUG=true
NODE_ENV=development

# Restart server
bun run dev

# Check logs for detailed error messages
```

### Getting Help

1. Check the documentation in `/docs`
2. Review the [Implementation Log](/docs/IMPLEMENTATION_LOG.md)
3. Check [Codebase Analysis](/docs/CODEBASE_ANALYSIS.md)
4. Review original [Typebot docs](https://docs.typebot.io)

---

## Multi-Client Deployment

### Scenario: Deploying for Multiple Clients

#### Option A: Separate Instances (Recommended)

```bash
# Client A
/var/www/clienta/
├── .env (BRAND_NAME=ClientA)
├── DATABASE_URL=...clienta_db
└── domains: app.clienta.com

# Client B
/var/www/clientb/
├── .env (BRAND_NAME=ClientB)
├── DATABASE_URL=...clientb_db
└── domains: app.clientb.com
```

#### Option B: Docker with Different Configs

```bash
# docker-compose.clienta.yml
services:
  builder:
    environment:
      - BRAND_NAME=ClientA
      - DATABASE_URL=postgresql://...clienta_db

# docker-compose.clientb.yml
services:
  builder:
    environment:
      - BRAND_NAME=ClientB
      - DATABASE_URL=postgresql://...clientb_db
```

Run with:
```bash
docker-compose -f docker-compose.clienta.yml up -d
docker-compose -f docker-compose.clientb.yml -p clientb up -d
```

---

## Maintenance

### Updates

```bash
# 1. Backup database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 2. Pull latest changes
git pull origin main

# 3. Update dependencies
bun install

# 4. Rebuild
bun run build

# 5. Restart
# Docker: docker-compose restart
# Manual: kill and restart process
```

### Backups

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/db_$DATE.sql
gzip backups/db_$DATE.sql

# Keep only last 7 days
find backups/ -name "db_*.sql.gz" -mtime +7 -delete
```

### Monitoring

Consider setting up:
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry - already integrated)
- Performance monitoring (New Relic, DataDog)
- Log aggregation (ELK stack, CloudWatch)

---

## Next Steps

After successful deployment:

1. **Customize Content**
   - Update email templates
   - Modify landing page content
   - Create help documentation

2. **Integrate Services**
   - Set up OAuth providers
   - Configure AI integrations (OpenAI, Anthropic)
   - Connect analytics (PostHog, Google Analytics)

3. **Scale Infrastructure**
   - Add load balancer
   - Set up CDN
   - Implement caching (Redis)
   - Add monitoring

4. **User Management**
   - Set up admin users
   - Configure user roles
   - Implement SSO (if needed)

---

**Last Updated**: 2025-12-25
**Version**: 1.0.0
**Maintained by**: [Your Team Name]
