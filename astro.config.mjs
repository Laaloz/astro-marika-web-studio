import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";

import sanity from "@sanity/astro";

const site =
  process.env.PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (process.env.CONTEXT === "production" ? process.env.URL : undefined);

// https://astro.build/config
export default defineConfig({
  site,
  // Ohjaa vanha etusivun duplikaattiosoite oikeaan etusivuun (301)
  redirects: {
    "/etusivu": "/",
  },
  adapter: netlify({
    middlewareMode: "edge",
  }),
  image: {
    remotePatterns: [{
      protocol: "https",
      hostname: "cdn.sanity.io",
    }],
  },
  integrations: [
    sitemap({
      // Jätä pois kehitys-/demosivut, joiden ei kuulu näkyä Googlessa
      filter: (page) =>
        !/\/(styleguide|markdown-page)\/?$/.test(page),
    }),
    sanity({
      projectId: "og5aa4k3",
      dataset: "production",
      useCdn: false, // for static builds
    }),
  ],
});
