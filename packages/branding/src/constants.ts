/**
 * Brand Constants
 *
 * This file contains constant values related to branding that don't change based on environment.
 * For environment-based configuration, use config.ts instead.
 */

/**
 * Default logo dimensions
 */
export const LOGO_DIMENSIONS = {
  header: {
    width: 120,
    height: 32,
  },
  email: {
    width: 150,
    height: 40,
  },
  footer: {
    width: 100,
    height: 26,
  },
  favicon: {
    width: 32,
    height: 32,
  },
} as const;

/**
 * Supported theme modes
 */
export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

/**
 * Brand asset paths
 * These paths are relative to the public directory
 */
export const BRAND_ASSETS = {
  logo: {
    light: "/images/logo-light.svg",
    dark: "/images/logo-dark.svg",
    default: "/images/logo.png",
  },
  favicon: {
    ico: "/favicon.ico",
    svg: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  og: {
    default: "/images/og-image.png",
    twitter: "/images/twitter-card.png",
  },
} as const;

/**
 * Copyright year range
 */
export const COPYRIGHT_YEAR_START = 2023;
export const COPYRIGHT_YEAR_CURRENT = new Date().getFullYear();
export const COPYRIGHT_YEAR_RANGE =
  COPYRIGHT_YEAR_START === COPYRIGHT_YEAR_CURRENT
    ? `${COPYRIGHT_YEAR_CURRENT}`
    : `${COPYRIGHT_YEAR_START}-${COPYRIGHT_YEAR_CURRENT}`;

/**
 * Default meta tags
 */
export const DEFAULT_META = {
  title: "Chatbot Builder",
  titleTemplate: "%s | Chatbot Builder",
  description: "Build powerful chatbots visually",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#FF5925",
} as const;
