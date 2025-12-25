/**
 * BrandedFooter Component
 *
 * A reusable footer component with brand information and links
 */

import type * as React from "react";
import { brandConfig } from "../config";
import { COPYRIGHT_YEAR_RANGE } from "../constants";
import { Logo } from "./Logo";

export interface BrandedFooterProps {
  /**
   * Show the logo in the footer
   */
  showLogo?: boolean;
  /**
   * Show social media links
   */
  showSocial?: boolean;
  /**
   * Show "Powered by" attribution
   */
  showPoweredBy?: boolean;
  /**
   * Custom className for the footer container
   */
  className?: string;
  /**
   * Additional links to display
   */
  customLinks?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

export const BrandedFooter: React.FC<BrandedFooterProps> = ({
  showLogo = true,
  showSocial = true,
  showPoweredBy = false,
  className = "",
  customLinks = [],
}) => {
  const socialLinks = [
    { name: "GitHub", url: brandConfig.social.github, icon: "github" },
    { name: "Discord", url: brandConfig.social.discord, icon: "discord" },
    { name: "Twitter", url: brandConfig.social.twitter, icon: "twitter" },
    { name: "LinkedIn", url: brandConfig.social.linkedin, icon: "linkedin" },
  ].filter((link) => link.url);

  return (
    <footer className={`border-t py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo Section */}
          {showLogo && (
            <div className="flex items-center gap-2">
              <Logo size="footer" />
            </div>
          )}

          {/* Links Section */}
          {customLinks.length > 0 && (
            <nav className="flex gap-4">
              {customLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Social Links */}
          {showSocial && socialLinks.length > 0 && (
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  aria-label={social.name}
                >
                  {social.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            &copy; {COPYRIGHT_YEAR_RANGE} {brandConfig.company.legalName}. All
            rights reserved.
          </p>
          {showPoweredBy && brandConfig.features.showPoweredBy && (
            <p className="mt-1 text-xs">Powered by {brandConfig.displayName}</p>
          )}
        </div>
      </div>
    </footer>
  );
};
