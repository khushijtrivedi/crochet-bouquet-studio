// ─── i18n Helper ─────────────────────────────────────────────────────────────
// A zero-dependency translation utility.
// Drop-in replacement path: swap `t()` calls for `useTranslations()` (next-intl)
// or `useTranslation()` (next-i18next) when you're ready — no data file changes needed.

import { en, type LocaleKey } from "@/locales/en";

// Extend with more locale objects as you add languages:
// import { fr } from "@/locales/fr";
const locales = { en } as const;
type SupportedLocale = keyof typeof locales;

/**
 * Resolves a locale key to its display string.
 *
 * @param key    - A key from your locale file, e.g. "flower.red-rose.name"
 * @param locale - Defaults to "en"; extend as you add languages
 *
 * @example
 *   t("flower.red-rose.name")          // → "Red Rose"
 *   t("flower.sunflower.alt", "en")    // → "Bright yellow sunflower facing the sun"
 */
export function t(key: LocaleKey, locale: SupportedLocale = "en"): string {
  return locales[locale][key] ?? key; // falls back to the raw key — never crashes
}