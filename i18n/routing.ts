/**
 * next-intl routing configuration.
 *
 * This is the single source of truth for supported locales and the default
 * locale. The list intentionally mirrors SUPPORTED_LOCALES in lib/i18n/config.ts
 * — keep them in sync when adding a new language.
 *
 * localePrefix: 'as-needed'
 *   Default locale (English) uses no URL prefix → /about
 *   Non-default locales use a prefix              → /fr/about, /es/about
 *   This matches the previous custom-middleware behaviour and ensures existing
 *   English URLs are never broken.
 *
 * Adding a new language:
 *   1. Add the locale code to the `locales` array below.
 *   2. Add the same code to SUPPORTED_LOCALES in lib/i18n/config.ts.
 *   3. Optionally add a message file at lib/i18n/messages/<locale>.json.
 *   4. Publish content in the new language in Optimizely CMS.
 *   The language switcher updates automatically via getEnabledLanguages().
 */

import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es', 'fr', 'de'] as const,
  defaultLocale: 'en',

  // Default locale uses no URL prefix; all others are prefixed.
  localePrefix: 'as-needed',

  // URL is the single source of truth for locale.
  // With localeDetection: true (the default), next-intl stores the locale in a
  // NEXT_LOCALE cookie. When the user navigates to '/' (English, no prefix),
  // the middleware reads the stale cookie (e.g. 'es') and redirects them back
  // to '/es/' — making it impossible to return to English via the locale picker.
  //
  // Disabling detection means locale is read only from the URL prefix.
  // First-time visitors always land on the default locale (English) at '/'.
  // Non-English content is reached explicitly via the language switcher.
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]
