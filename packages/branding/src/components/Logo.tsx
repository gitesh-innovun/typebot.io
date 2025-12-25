/**
 * Logo Component
 *
 * A reusable branded logo component that adapts to light/dark themes
 * and can be sized appropriately for different contexts.
 */

import type * as React from "react";
import { brandConfig } from "../config";
import { BRAND_ASSETS, LOGO_DIMENSIONS } from "../constants";

export interface LogoProps {
  /**
   * Size preset for the logo
   */
  size?: "header" | "email" | "footer" | "favicon" | "custom";
  /**
   * Custom width (only used when size='custom')
   */
  width?: number;
  /**
   * Custom height (only used when size='custom')
   */
  height?: number;
  /**
   * Theme mode: light, dark, or auto (adapts to system)
   */
  theme?: "light" | "dark" | "auto";
  /**
   * Custom className for styling
   */
  className?: string;
  /**
   * Alt text for the logo image
   */
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "header",
  width,
  height,
  theme = "auto",
  className = "",
  alt,
}) => {
  const dimensions =
    size === "custom"
      ? { width: width || 120, height: height || 32 }
      : LOGO_DIMENSIONS[size];

  // Determine which logo to use based on theme
  const getLogoSrc = () => {
    if (theme === "light") return BRAND_ASSETS.logo.light;
    if (theme === "dark") return BRAND_ASSETS.logo.dark;
    // For 'auto', we'll use the default and let CSS handle theme switching
    return BRAND_ASSETS.logo.default;
  };

  const logoAlt = alt || `${brandConfig.displayName} logo`;

  return (
    <img
      src={getLogoSrc()}
      alt={logoAlt}
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
};

/**
 * LogoText Component
 *
 * Renders the brand name as text (useful for text-based logos)
 */
export interface LogoTextProps {
  /**
   * Use display name instead of short name
   */
  useDisplayName?: boolean;
  /**
   * Custom className for styling
   */
  className?: string;
  /**
   * HTML tag to use
   */
  as?: "h1" | "h2" | "h3" | "span" | "div";
}

export const LogoText: React.FC<LogoTextProps> = ({
  useDisplayName = true,
  className = "",
  as: Component = "span",
}) => {
  const text = useDisplayName ? brandConfig.displayName : brandConfig.name;

  return <Component className={className}>{text}</Component>;
};

/**
 * LogoWithText Component
 *
 * Combines logo image with text
 */
export interface LogoWithTextProps extends Omit<LogoProps, "alt"> {
  /**
   * Show text next to logo
   */
  showText?: boolean;
  /**
   * Text position relative to logo
   */
  textPosition?: "right" | "bottom";
  /**
   * Custom className for the container
   */
  containerClassName?: string;
  /**
   * Custom className for the text
   */
  textClassName?: string;
}

export const LogoWithText: React.FC<LogoWithTextProps> = ({
  showText = true,
  textPosition = "right",
  containerClassName = "",
  textClassName = "",
  ...logoProps
}) => {
  const containerClass =
    textPosition === "right"
      ? "inline-flex items-center gap-2"
      : "inline-flex flex-col items-center gap-1";

  return (
    <div className={`${containerClass} ${containerClassName}`}>
      <Logo {...logoProps} />
      {showText && <LogoText className={textClassName} />}
    </div>
  );
};
