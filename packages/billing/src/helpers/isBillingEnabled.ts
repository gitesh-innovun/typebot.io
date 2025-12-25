/**
 * Billing Feature Flag Helper
 *
 * This helper checks if billing/subscription features should be enabled
 * based on environment configuration.
 */

import { env } from "@typebot.io/env";

/**
 * Check if billing/subscription system is enabled
 *
 * @returns true if billing is enabled, false if disabled
 *
 * @example
 * if (isBillingEnabled()) {
 *   // Show subscription UI
 * }
 */
export const isBillingEnabled = (): boolean => {
  return (
    !env.NEXT_PUBLIC_DISABLE_BILLING &&
    env.NEXT_PUBLIC_BILLING_MODE === "STRIPE"
  );
};

/**
 * Check if we're in unlimited billing mode
 *
 * @returns true if unlimited mode is active
 *
 * @example
 * if (isUnlimitedBillingMode()) {
 *   // Skip usage checks
 * }
 */
export const isUnlimitedBillingMode = (): boolean => {
  return env.NEXT_PUBLIC_BILLING_MODE === "UNLIMITED";
};

/**
 * Check if we're in custom billing mode
 *
 * @returns true if custom billing mode is active
 *
 * @example
 * if (isCustomBillingMode()) {
 *   // Use custom billing logic
 * }
 */
export const isCustomBillingMode = (): boolean => {
  return env.NEXT_PUBLIC_BILLING_MODE === "CUSTOM";
};

/**
 * Get the current billing mode
 *
 * @returns 'STRIPE' | 'UNLIMITED' | 'CUSTOM'
 */
export const getBillingMode = (): "STRIPE" | "UNLIMITED" | "CUSTOM" => {
  return env.NEXT_PUBLIC_BILLING_MODE;
};

/**
 * Check if Stripe integration should be used
 *
 * @returns true if Stripe should be used for payments
 */
export const shouldUseStripe = (): boolean => {
  return isBillingEnabled() && env.NEXT_PUBLIC_BILLING_MODE === "STRIPE";
};
