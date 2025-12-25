# @typebot.io/branding

Centralized branding package for white-labeling the Typebot application.

## Purpose

This package provides a single source of truth for all branding-related configuration, making it easy to:
- Customize the application for different clients
- Deploy white-labeled instances with environment variables
- Maintain consistent branding across all apps and packages

## Installation

This package is internal to the Typebot monorepo and is automatically available to all apps and packages.

```json
{
  "dependencies": {
    "@typebot.io/branding": "workspace:*"
  }
}
```

## Usage

### Brand Configuration

Access brand configuration anywhere in the application:

```typescript
import { brandConfig } from '@typebot.io/branding'

console.log(brandConfig.displayName) // "YourBrand"
console.log(brandConfig.tagline) // "Your tagline"
console.log(brandConfig.domains.builder) // "https://app.yourbrand.com"
console.log(brandConfig.colors.primary) // "#FF5925"
```

### Logo Component

Use the branded Logo component:

```tsx
import { Logo, LogoWithText } from '@typebot.io/branding'

// Simple logo
<Logo size="header" />

// Logo with different sizes
<Logo size="email" />
<Logo size="footer" />
<Logo size="favicon" />

// Custom size
<Logo size="custom" width={200} height={50} />

// Logo with text
<LogoWithText showText textPosition="right" />

// Theme-aware logo
<Logo theme="dark" />
```

### Branded Footer

Use the branded footer component:

```tsx
import { BrandedFooter } from '@typebot.io/branding'

<BrandedFooter
  showLogo={true}
  showSocial={true}
  showPoweredBy={false}
  customLinks={[
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ]}
/>
```

### Helper Utilities

```typescript
import {
  generatePageTitle,
  generateMetaDescription,
  getDomainUrl,
  isFeatureEnabled,
  getSupportMailto,
  isWhiteLabelMode,
} from '@typebot.io/branding'

// Generate page title
const title = generatePageTitle('Dashboard') // "Dashboard | YourBrand"

// Generate meta description
const desc = generateMetaDescription('Manage your chatbots')

// Get domain URLs
const builderUrl = getDomainUrl('builder')
const viewerUrl = getDomainUrl('viewer')

// Check features
if (isFeatureEnabled('showBranding')) {
  // Show branding
}

// Generate mailto links
const supportLink = getSupportMailto('Help needed', 'I need help with...')

// Check if white-label mode
if (isWhiteLabelMode()) {
  // Hide Typebot branding
}
```

### Theme Colors

```typescript
import { brandColors, hexToRgb, generateColorShades } from '@typebot.io/branding'

// Use brand colors
console.log(brandColors.primary) // "#FF5925"

// Convert hex to RGB
const rgb = hexToRgb('#FF5925') // { r: 255, g: 89, b: 37 }

// Generate color shades
const shades = generateColorShades('#FF5925')
```

## Environment Variables

Configure branding using environment variables:

### Brand Identity
```bash
BRAND_NAME=YourBrand
BRAND_DISPLAY_NAME="Your Brand Name"
BRAND_TAGLINE="Your tagline here"
BRAND_DESCRIPTION="Your description"
```

### Domains
```bash
NEXT_PUBLIC_BUILDER_URL=https://app.yourbrand.com
NEXT_PUBLIC_VIEWER_URL=https://chat.yourbrand.com
NEXT_PUBLIC_LANDING_URL=https://yourbrand.com
NEXT_PUBLIC_DOCS_URL=https://docs.yourbrand.com
```

### Company Information
```bash
COMPANY_NAME="Your Company Inc."
COMPANY_LEGAL_NAME="Your Company Legal Name"
SUPPORT_EMAIL=support@yourbrand.com
SALES_EMAIL=sales@yourbrand.com
COMPANY_ADDRESS="Your address"
```

### Visual Branding
```bash
BRAND_PRIMARY_COLOR=#0066CC
BRAND_SECONDARY_COLOR=#FF5925
BRAND_ACCENT_COLOR=#00CC66
```

### Social Links
```bash
BRAND_GITHUB_URL=https://github.com/yourorg
BRAND_DISCORD_URL=https://discord.gg/yourserver
BRAND_TWITTER_URL=https://twitter.com/yourbrand
BRAND_LINKEDIN_URL=https://linkedin.com/company/yourbrand
```

### Feature Flags
```bash
SHOW_TYPEBOT_BRANDING=false
SHOW_POWERED_BY=false
ENABLE_MARKETPLACE=true
ENABLE_COMMUNITY_TEMPLATES=true
```

### SEO
```bash
BRAND_KEYWORDS=chatbot,automation,ai
BRAND_OG_IMAGE=/images/custom-og.png
```

## File Structure

```
packages/branding/
├── src/
│   ├── index.ts              # Main exports
│   ├── config.ts             # Brand configuration
│   ├── constants.ts          # Brand constants
│   ├── components/
│   │   ├── Logo.tsx          # Logo component
│   │   └── BrandedFooter.tsx # Footer component
│   ├── theme/
│   │   └── colors.ts         # Color utilities
│   └── utils/
│       └── helpers.ts        # Helper functions
├── package.json
├── tsconfig.json
└── README.md
```

## Customization

### Replace Visual Assets

1. Replace logo files in your public directory:
   - `/public/images/logo.png` - Default logo
   - `/public/images/logo-light.svg` - Light theme logo
   - `/public/images/logo-dark.svg` - Dark theme logo
   - `/public/favicon.svg` - Favicon
   - `/public/images/og-image.png` - Social preview image

2. Update the `BRAND_ASSETS` constant if using different paths

### Extend Brand Configuration

You can extend the brand configuration by modifying `src/config.ts`:

```typescript
export const brandConfig = {
  // ... existing config
  custom: {
    myCustomValue: getEnvVar('MY_CUSTOM_VALUE', 'default'),
  },
}
```

## Best Practices

1. **Use environment variables** - Never hardcode brand values in code
2. **Import from branding package** - Don't access `process.env` directly
3. **Use components** - Use `<Logo />` instead of `<img src="/logo.png" />`
4. **Check feature flags** - Use `isFeatureEnabled()` before showing optional features
5. **Generate metadata** - Use helper functions for page titles and descriptions

## Examples

### Next.js Layout

```tsx
import { brandConfig, Logo, generatePageTitle } from '@typebot.io/branding'

export const metadata = {
  title: generatePageTitle('Dashboard'),
  description: brandConfig.description,
}

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <header>
          <Logo size="header" />
        </header>
        {children}
      </body>
    </html>
  )
}
```

### Email Template

```tsx
import { Logo, brandConfig, COPYRIGHT_YEAR_RANGE } from '@typebot.io/branding'

export function WelcomeEmail() {
  return (
    <div>
      <Logo size="email" />
      <h1>Welcome to {brandConfig.displayName}</h1>
      <p>{brandConfig.tagline}</p>
      <footer>
        &copy; {COPYRIGHT_YEAR_RANGE} {brandConfig.company.legalName}
      </footer>
    </div>
  )
}
```

### Landing Page

```tsx
import { brandConfig, BrandedFooter, isWhiteLabelMode } from '@typebot.io/branding'

export function LandingPage() {
  return (
    <div>
      <h1>{brandConfig.tagline}</h1>
      <p>{brandConfig.description}</p>

      {!isWhiteLabelMode() && (
        <a href="https://typebot.io">Powered by Typebot</a>
      )}

      <BrandedFooter
        showLogo
        showSocial
        customLinks={[
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
        ]}
      />
    </div>
  )
}
```

## Migration Guide

### Before (Hardcoded)
```tsx
// ❌ Don't do this
<img src="/images/logo.png" alt="Typebot" />
<title>Dashboard | Typebot</title>
```

### After (Branded)
```tsx
// ✅ Do this
import { Logo, generatePageTitle } from '@typebot.io/branding'

<Logo size="header" />
<title>{generatePageTitle('Dashboard')}</title>
```

## License

Same as parent project: FSL-1.1-Apache-2.0
