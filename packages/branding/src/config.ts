/**
 * Centralized Brand Configuration
 *
 * This module provides a single source of truth for all branding-related configuration.
 * It reads from environment variables with sensible defaults, making it easy to
 * white-label the application for different clients.
 *
 * Usage:
 *   import { brandConfig } from '@typebot.io/branding/config'
 *   console.log(brandConfig.name) // "YourBrand" or default "Typebot"
 */

import { env } from "@typebot.io/env";

export interface BrandConfig {
  // Brand Identity
  name: string;
  displayName: string;
  tagline: string;
  description: string;

  // Domains
  domains: {
    builder: string;
    viewer: string;
    landing: string;
    docs: string;
  };

  // Company Information
  company: {
    name: string;
    legalName: string;
    supportEmail: string;
    salesEmail: string;
    address?: string;
  };

  // Visual Branding
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };

  // Social Links
  social: {
    github?: string;
    discord?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };

  // Feature Flags
  features: {
    showBranding: boolean;
    showPoweredBy: boolean;
    enableMarketplace: boolean;
    enableCommunityTemplates: boolean;
  };

  // SEO & Marketing
  seo: {
    keywords: string[];
    ogImage?: string;
  };
}

/**
 * Helper to get current origin (works on both server and client)
 */
const getOrigin = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
};

/**
 * Main brand configuration object
 * Override values using environment variables
 */
export const brandConfig: BrandConfig = {
  // Brand Identity
  name: env.NEXT_PUBLIC_BRAND_NAME,
  displayName: env.NEXT_PUBLIC_BRAND_DISPLAY_NAME,
  tagline: env.NEXT_PUBLIC_BRAND_TAGLINE,
  description: env.NEXT_PUBLIC_BRAND_DESCRIPTION,

  // Domains
  domains: {
    builder: getOrigin(),
    viewer: Array.isArray(env.NEXT_PUBLIC_VIEWER_URL)
      ? env.NEXT_PUBLIC_VIEWER_URL[0]
      : env.NEXT_PUBLIC_VIEWER_URL,
    landing: getOrigin(),
    docs: "https://docs.typebot.io",
  },

  // Company Information
  company: {
    name: env.NEXT_PUBLIC_COMPANY_NAME,
    legalName: env.NEXT_PUBLIC_COMPANY_NAME,
    supportEmail: env.NEXT_PUBLIC_SUPPORT_EMAIL,
    salesEmail: env.NEXT_PUBLIC_SUPPORT_EMAIL,
    address: "",
  },

  // Visual Branding
  colors: {
    primary: env.NEXT_PUBLIC_BRAND_PRIMARY_COLOR,
    secondary: "",
    accent: "",
  },

  // Social Links
  social: {
    github: "https://github.com/baptisteArno/typebot.io",
    discord: "https://typebot.io/discord",
    twitter: "https://twitter.com/Typebot_io",
    linkedin: "",
    youtube: "",
  },

  // Feature Flags
  features: {
    showBranding: true,
    showPoweredBy: false,
    enableMarketplace: true,
    enableCommunityTemplates: true,
  },

  // SEO & Marketing
  seo: {
    keywords: ["chatbot", "builder", "automation", "conversational", "ai"],
    ogImage: "",
  },
};

/**
 * Helper function to get brand name with fallback
 */
export const getBrandName = (): string =>
  brandConfig.displayName || brandConfig.name;

/**
 * Helper function to check if we should show Typebot branding
 */
export const shouldShowBranding = (): boolean =>
  brandConfig.features.showBranding;

/**
 * Helper function to get primary color
 */
export const getPrimaryColor = (): string => brandConfig.colors.primary;

/**
 * Helper function to get support email
 */
export const getSupportEmail = (): string => brandConfig.company.supportEmail;
