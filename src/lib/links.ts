/**
 * Normalisoi CMS:stä tai koodista tulevan linkin.
 *
 * - Ulkoiset osoitteet, mailto:, tel: ja ankkurit palautetaan sellaisenaan.
 * - Sisäiset polut saavat alkuun kauttaviivan ja loppuun kauttaviivan
 *   (`/palvelut` -> `/palvelut/`). Sivut renderöidään hakemistoina
 *   (`/palvelut/index.html`), joten ilman loppukauttaviivaa Netlify tekee
 *   jokaisesta sisäisestä klikkauksesta 301-uudelleenohjauksen, joka maksaa
 *   mobiilissa helposti puolisen sekuntia ennen kuin sivu alkaa latautua.
 */
export function normalizeHref(href?: string | null, fallback = '#'): string {
  if (typeof href !== 'string') return fallback
  const trimmed = href.trim()
  if (!trimmed) return fallback

  if (
    /^[a-z][a-z0-9+.-]*:/i.test(trimmed) || // http:, https:, mailto:, tel: ...
    trimmed.startsWith('//') ||
    trimmed.startsWith('#')
  ) {
    return trimmed
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return ensureTrailingSlash(withLeadingSlash)
}

/** Lisää loppukauttaviivan sisäiseen polkuun, säilyttää query-osan ja ankkurin. */
export function ensureTrailingSlash(path: string): string {
  const match = path.match(/^([^?#]*)(.*)$/)
  if (!match) return path
  const [, pathname, suffix] = match
  if (!pathname || pathname.endsWith('/')) return path
  // Tiedostopolut (esim. /sitemap-index.xml, /kuva.png) jätetään rauhaan.
  if (/\.[a-z0-9]+$/i.test(pathname)) return path
  return `${pathname}/${suffix}`
}
