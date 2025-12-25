/**
 * Branding Helper Utilities
 *
 * Utility functions for working with brand configuration throughout the application
 */

import { brandConfig } from "../config";

/**
 * Generate page title with brand name
 *
 * @example
 * generatePageTitle('Dashboard') // "Dashboard | YourBrand"
 */
export const generatePageTitle = (pageTitle: string): string => {
  return `${pageTitle} | ${brandConfig.displayName}`;
};

/**
 * Generate meta description with brand context
 *
 * @example
 * generateMetaDescription('Manage your chatbots')
 * // "Manage your chatbots with YourBrand - Build powerful chatbots visually"
 */
export const generateMetaDescription = (description: string): string => {
  return `${description} with ${brandConfig.displayName} - ${brandConfig.tagline}`;
};

/**
 * Get the appropriate domain URL based on environment
 */
export const getDomainUrl = (
  domain: keyof typeof brandConfig.domains,
): string => {
  return brandConfig.domains[domain];
};

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (
  feature: keyof typeof brandConfig.features,
): boolean => {
  return brandConfig.features[feature];
};

/**
 * Get brand color with optional fallback
 */
export const getBrandColor = (
  color: keyof typeof brandConfig.colors,
  fallback: string = "#000000",
): string => {
  return brandConfig.colors[color] || fallback;
};

/**
 * Generate mailto link for support
 */
export const getSupportMailto = (subject?: string, body?: string): string => {
  const params = new URLSearchParams();
  if (subject) params.append("subject", subject);
  if (body) params.append("body", body);

  const queryString = params.toString();
  return `mailto:${brandConfig.company.supportEmail}${queryString ? `?${queryString}` : ""}`;
};

/**
 * Generate mailto link for sales
 */
export const getSalesMailto = (subject?: string, body?: string): string => {
  const params = new URLSearchParams();
  if (subject) params.append("subject", subject);
  if (body) params.append("body", body);

  const queryString = params.toString();
  return `mailto:${brandConfig.company.salesEmail}${queryString ? `?${queryString}` : ""}`;
};

/**
 * Check if we're in white-label mode (no Typebot branding)
 */
export const isWhiteLabelMode = (): boolean => {
  return !brandConfig.features.showBranding || brandConfig.name !== "Typebot";
};

/**
 * Get the appropriate brand asset URL
 */
export const getBrandAssetUrl = (assetPath: string): string => {
  // If it's already a full URL, return as is
  if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
    return assetPath;
  }

  // Otherwise, treat as relative path
  return assetPath;
};

/**
 * Generate structured data for SEO (JSON-LD)
 */
export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandConfig.company.name,
    legalName: brandConfig.company.legalName,
    url: brandConfig.domains.landing,
    logo: getBrandAssetUrl("/images/logo.png"),
    contactPoint: {
      "@type": "ContactPoint",
      email: brandConfig.company.supportEmail,
      contactType: "customer support",
    },
    sameAs: Object.values(brandConfig.social).filter(Boolean),
  };
};

/**
 * Generate OpenGraph meta tags
 */
export const generateOpenGraphTags = (params: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
}) => {
  return {
    "og:site_name": brandConfig.displayName,
    "og:title": params.title,
    "og:description": params.description,
    "og:url": params.url,
    "og:image":
      params.image || brandConfig.seo.ogImage || "/images/og-image.png",
    "og:type": params.type || "website",
    "twitter:card": "summary_large_image",
    "twitter:title": params.title,
    "twitter:description": params.description,
    "twitter:image":
      params.image || brandConfig.seo.ogImage || "/images/og-image.png",
  };
};
