/**
 * @typebot.io/branding
 *
 * Centralized branding package for white-labeling the Typebot application.
 *
 * This package provides a single source of truth for all branding-related
 * configuration, components, and utilities.
 *
 * @example
 * ```tsx
 * import { brandConfig, Logo, generatePageTitle } from '@typebot.io/branding'
 *
 * // Use brand configuration
 * console.log(brandConfig.displayName) // "YourBrand"
 *
 * // Use branded components
 * <Logo size="header" />
 *
 * // Use helper utilities
 * const title = generatePageTitle('Dashboard')
 * ```
 */

export type { BrandedFooterProps } from "./components/BrandedFooter";
export { BrandedFooter } from "./components/BrandedFooter";
export type {
  LogoProps,
  LogoTextProps,
  LogoWithTextProps,
} from "./components/Logo";
// Components
export { Logo, LogoText, LogoWithText } from "./components/Logo";
export type { BrandConfig } from "./config";
// Core configuration
export {
  brandConfig,
  getBrandName,
  getPrimaryColor,
  getSupportEmail,
  shouldShowBranding,
} from "./config";
export type { ThemeMode } from "./constants";
// Constants
export {
  BRAND_ASSETS,
  COPYRIGHT_YEAR_CURRENT,
  COPYRIGHT_YEAR_RANGE,
  COPYRIGHT_YEAR_START,
  DEFAULT_META,
  LOGO_DIMENSIONS,
  THEME_MODES,
} from "./constants";

// Theme
export {
  brandColors,
  generateColorShades,
  getAccentColor,
  getPrimaryColor as getThemePrimaryColor,
  getSecondaryColor,
  hexToRgb,
  hexToRgbString,
} from "./theme/colors";

// Utilities
export {
  generateMetaDescription,
  generateOpenGraphTags,
  generateOrganizationStructuredData,
  generatePageTitle,
  getBrandAssetUrl,
  getBrandColor,
  getDomainUrl,
  getSalesMailto,
  getSupportMailto,
  isFeatureEnabled,
  isWhiteLabelMode,
} from "./utils/helpers";
