/**
 * Next.js proxy — locale detection and URL normalisation via next-intl.
 * (Next.js 16+ renames "middleware" → "proxy"; same concept, new file name.)
 *
 * Strategy (localePrefix: 'as-needed'):
 *   - Default locale (English) → no URL prefix  (/about)
 *   - Non-default locales      → URL prefix      (/fr/about, /es/about, /de/about)
 *
 * next-intl handles:
 *   1. Detecting locale from the URL prefix.
 *   2. Falling back to the Accept-Language header for first-time visitors.
 *   3. Internally rewriting prefixed paths so the catch-all slug handler
 *      receives the bare path (e.g. /fr/about → /about internally).
 *   4. Exposing the resolved locale to server components via getLocale().
 *   5. Redirecting /en/... → /... (default locale never uses a prefix).
 *
 * Excluded from proxy (see matcher):
 *   - /api/*     — API routes have their own locale handling (or none).
 *   - /preview   — CMS preview route: locale comes from search params (loc=).
 *   - /_next/*   — Next.js build artefacts.
 *   - Static file extensions (svg, png, woff2, etc.).
 */

import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *   - api routes (handled separately)
     *   - /preview (CMS preview; locale resolved from ?loc= param)
     *   - _next/static, _next/image (Next.js internals)
     *   - Static files with well-known extensions
     */
    '/((?!api|preview|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)',
  ],
}
