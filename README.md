# Studio Maura

Lähdekoodi sivustolle [studiomaura.fi](https://studiomaura.fi), jyväskyläläisen
verkkosuunnittelustudion kotisivuille. Sivusto on rakennettu
[Astrolla](https://astro.build), sisältö tulee [Sanity](https://www.sanity.io)-CMS:stä
ja julkaisu tapahtuu [Netlifyssä](https://www.netlify.com). Kaikki sivut
renderöidään staattisesti build-aikana, joten Sanityn sisältömuutos näkyy vasta
seuraavan buildin jälkeen.

## Sisältö

- [Teknologiat](#teknologiat)
- [Vaatimukset](#vaatimukset)
- [Käynnistys](#käynnistys)
- [Ympäristömuuttujat](#ympäristömuuttujat)
- [Rakenne](#rakenne)
- [Sisältömalli ja sivunrakentaja](#sisältömalli-ja-sivunrakentaja)
- [SEO ja löydettävyys](#seo-ja-löydettävyys)
- [Julkaisu](#julkaisu)

## Teknologiat

- **Astro 6** ja Netlify-adapteri (`@astrojs/netlify`, edge-middleware-tila) sekä
  sitemap-integraatio (`@astrojs/sitemap`).
- **Sanity**: `@sanity/astro` tarjoaa clientin (`sanity:client`), `@sanity/image-url`
  rakentaa kuvien osoitteet ja `astro-portabletext` renderöi rikastetun tekstin.
  Projekti `og5aa4k3`, dataset `production`. CDN on pois päältä (`useCdn: false`),
  koska sisältö haetaan vain buildissa. Sanity Studio ei ole tässä repossa; paketit
  `sanity`, `react`, `react-dom` ja `styled-components` ovat integraation vaatimia
  riippuvuuksia.
- **Tyylit**: tavallista CSS:ää design-tokeneilla (`src/styles/tokens.css`), ei
  Tailwindia eikä muuta CSS-frameworkia. Fontit: Fraunces otsikoissa
  (`@fontsource-variable/fraunces`) ja Inter leipätekstissä (`public/fonts/`).
- **Swiper** web-komponenttina pakettikarusellissa, **sharp** kuvien käsittelyyn.
- **Lomakkeet** Netlify Formsilla (honeypot ja reCAPTCHA). **Evästeet** Cookiebotilla.
  **Analytiikka** Google Tag Managerilla ja Consent Mode v2:lla: kaikki
  tallennusluvat ovat oletuksena kiellettyjä ja päivittyvät Cookiebotin
  suostumuksesta.

## Vaatimukset

- Node.js 22.12 tai uudempi (`engines` tiedostossa `package.json`)
- [pnpm](https://pnpm.io) (lukkotiedosto `pnpm-lock.yaml`)
- Verkkoyhteys buildissa ja kehityksessä, koska sisältö haetaan Sanitysta.
  Konfiguraatiossa ei ole API-tokenia, joten datasetin on oltava julkisesti
  luettava.

## Käynnistys

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

| Komento | Mitä tekee |
|---|---|
| `pnpm dev` | Kehityspalvelin |
| `pnpm build` | Staattinen build hakemistoon `dist/`, sen jälkeen `scripts/indexnow.mjs` |
| `pnpm preview` | Buildatun sivuston esikatselu |
| `pnpm astro ...` | Astro CLI |

`pnpm-workspace.yaml` estää pakettien `sharp`, `esbuild` ja `@parcel/watcher`
asennusaikaiset build-skriptit; ne käyttävät valmiita binäärejä.

## Ympäristömuuttujat

| Muuttuja | Käyttö |
|---|---|
| `PUBLIC_GTM_ID` | Google Tag Manager -kontin tunnus. Tyhjänä GTM:ää ja consent-skriptiä ei ladata lainkaan. |
| `PUBLIC_SITE_URL` tai `SITE_URL` | Sivuston kanoninen osoite (`site` Astro-konfiguraatiossa): canonical-linkit, sitemap ja OG-osoitteet. Netlifyn tuotantobuildissa käytetään Netlifyn omaa `URL`-muuttujaa, jos näitä ei ole asetettu. |
| `CONTEXT` | Netlifyn asettama. Arvolla `production` IndexNow-ping ajetaan buildin jälkeen; paikalliset ja preview-buildit ohittavat sen. |

Paikallisesti muuttujat laitetaan `.env`-tiedostoon (gitignoressa).

## Rakenne

```
.
├── astro.config.mjs            # site, redirect /etusivu → /, Netlify-adapteri, sitemap, Sanity
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json               # astro/tsconfigs/strict + @sanity/astro/module-tyypit
├── scripts/
│   └── indexnow.mjs            # Lähettää sitemapin URL:t IndexNow'hun tuotantobuildin jälkeen
├── public/
│   ├── fonts/                  # inter-latin.woff2, fraunces-latin.woff2
│   ├── favicon.ico, favicon.svg
│   ├── robots.txt              # Sallii kaiken ja osoittaa sitemap-index.xml:ään
│   ├── llms.txt                # Sivuston kuvaus tekoälyhakuja varten
│   ├── BingSiteAuth.xml        # Bing Webmaster -vahvistus
│   └── <avain>.txt             # IndexNow-avaintiedosto
└── src/
    ├── pages/
    │   ├── index.astro         # Etusivu: Sanity-sivu slugilla "home" tai "etusivu"
    │   ├── [...slug].astro     # Muut Sanity-sivut (page) slugin mukaan
    │   ├── referenssit/[slug].astro   # Referenssisivut (referenceItem)
    │   ├── posts/index.astro   # Postauslistaus (post)
    │   ├── posts/[slug].astro  # Yksittäinen postaus
    │   ├── styleguide.astro    # Design-tokenien esittelysivu (ei sitemapissa)
    │   ├── markdown-page.md    # Markdown-demo (ei sitemapissa)
    │   └── 404.astro
    ├── layouts/
    │   └── main.astro          # Head (SEO, OG, canonical, JSON-LD), GTM + Cookiebot, header, footer
    ├── components/
    │   ├── sections/           # Sivunrakentajan lohkot (ks. taulukko alla)
    │   ├── portable-text/      # Portable Text -lisäosat: kuva, hintahuomautus, sitaatti, taulukko
    │   ├── SanityImage.astro   # Responsiivinen <img> Sanity-kuvasta (srcset, fit, quality)
    │   └── Button.astro
    ├── lib/
    │   └── sanityImage.ts      # urlFor()-apuri (@sanity/image-url)
    ├── styles/
    │   ├── global.css          # Tuo kaikki alla olevat
    │   ├── fonts.css, tokens.css, base.css, buttons.css, components.css
    │   └── sections/           # Yksi tiedosto per lohko sekä header.css, footer.css ja index.css
    └── assets/                 # SVG-kuvitukset
```

`global.css` tuo lohkotyylit tiedoston `sections/index.css` kautta; vain
`sections/home-hero.css` tuodaan siitä erikseen.

Gitignoressa ovat `dist/`, `.astro/` (generoidut tyypit), `node_modules/`,
`.netlify/` ja `.env`-tiedostot.

## Sisältömalli ja sivunrakentaja

Sanityn dokumenttityypit, joita sivusto lukee:

- `siteSettings`: sivuston nimi, SEO-oletukset (`seoTitle`, `seoDescription`),
  OG-kuva, logot, päänavigaatio alavalikoineen sekä footerin yhteystiedot ja linkit.
  Koodissa on oletusnavigaatio siltä varalta, ettei Sanityssa ole määritelty mitään.
- `page`: sivu (`title`, `slug`, `seoDescription`, `pageBuilder`).
- `referenceItem`: referenssi (`title`, `slug`, `areas`, `shortDescription`,
  `quote`, `quoteAuthor`, `image`, ulkoinen linkki, `pageBuilder`).
- `post`: postaus (`title`, `slug`, `publishedAt`, `image`, `body`, `seoDescription`).

Sivut koostetaan `pageBuilder`-taulukosta. Jokainen lohkon `_type` vastaa yhtä
komponenttia hakemistossa `src/components/sections/`:

| Sanity `_type` | Komponentti | Huomio |
|---|---|---|
| `heroSection` | `HomeHeroSection` (etusivu), `HeroSection` (muut) | Hero-kuva esiladataan LCP:tä varten |
| `subpageHeroSection` | `SubpageHeroSection` | Ei etusivulla |
| `serviceHighlightsSection` | `ServiceHighlightsSection` | |
| `fiftyFiftyHighlightsSection` | `FiftyFiftyHighlightsSection` | |
| `fiftyFiftySimpleSection` | `FiftyFiftySimpleSection` | |
| `twoColumnContentSection` | `TwoColumnContentSection` | |
| `faqSection` | `FaqSection` | Tuottaa FAQPage-JSON-LD:n |
| `packageShowcaseSection` | `PackageShowcaseSection` | Swiper-karuselli |
| `largeImageSection` | `LargeImageSection` | |
| `imageGallerySection` | `ImageGallerySection` | |
| `imageRowSection` | `ImageRowSection` | Ei referenssisivuilla |
| `projectStepsSection` | `ProjectStepsSection` | |
| `aboutDesignerSection` | `AboutDesignerSection` | |
| `referenceSection` | `ReferenceSection` | Referenssit automaattisesti (uusimmat ensin) tai käsin valittuina |
| `callToActionSection` | `CallToActionSection` | |
| `contactFormSection` | `ContactFormSection` | Netlify Forms; kentät määritellään Sanityssa, oletuskentät koodissa. Ei etusivulla. |
| `contactLinksSection` | `ContactLinksSection` | |
| `centeredRichTextSection` | `CenteredRichTextSection` | |
| `cookieDeclarationSection` | `CookieDeclarationSection` | Upottaa Cookiebotin evästeselosteen |

`ReferenceHeroSection` ei ole lohko vaan referenssisivun kiinteä yläosa.

Uusi lohko lisätään neljään paikkaan: komponentti hakemistoon `sections/`, sen
tyylit hakemistoon `src/styles/sections/` ja tuonti tiedostoon
`src/styles/sections/index.css`, sekä lohkokartta jokaiseen sivupohjaan
(`index.astro`, `[...slug].astro` ja `referenssit/[slug].astro` listaavat lohkot
erikseen).

## SEO ja löydettävyys

- `main.astro` tuottaa title-, description-, canonical-, Open Graph- ja
  Twitter-tagit sekä `ProfessionalService`-JSON-LD:n (Jyväskylä, palvelut,
  yhteystiedot, Instagram). Otsikko ja kuvaus tulevat ensisijaisesti sivulta,
  sitten Site Settingsistä.
- `faqSection` tuottaa `FAQPage`-JSON-LD:n.
- Sitemap (`/sitemap-index.xml`) generoidaan buildissa; `styleguide` ja
  `markdown-page` jätetään pois. `robots.txt` viittaa sitemapiin.
- `/etusivu` ohjataan 301:llä juureen (vanha duplikaattiosoite).
- `public/llms.txt` kuvaa sivuston ja sen sivut tekoälyhakuja varten.
- IndexNow: `scripts/indexnow.mjs` lukee tiedoston `dist/sitemap-index.xml` ja
  lähettää URL:t osoitteeseen `api.indexnow.org` tuotantobuildin jälkeen.
  Epäonnistuminen ei kaada buildia.
- Sivu voi pyytää `noindex`-tagin (`404.astro` tekee näin).

## Julkaisu

Sivusto julkaistaan Netlifyssä Netlify-adapterilla. Build-asetukset ovat Netlifyn
puolella; repossa ei ole `netlify.toml`-tiedostoa. Repossa on haarat `main` ja
`production`.

Huomioita:

- Netlify Forms poimii lomakkeet build-aikana (`data-netlify="true"`), joten uusi
  lomake tai kenttä Sanityssa vaatii uuden buildin.
- Sanityn sisältömuutokset näkyvät vasta seuraavan buildin jälkeen, koska sivut
  renderöidään staattisesti.
- IndexNow-ping lähtee vain tuotantobuildista (`CONTEXT=production`).
