import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";

import sanity from "@sanity/astro";

const site =
  process.env.PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (process.env.CONTEXT === "production" ? process.env.URL : undefined);

// https://astro.build/config
export default defineConfig({
  site,
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
    // 👇 update these lines
    sanity({
      projectId: "og5aa4k3",
      dataset: "production",
      useCdn: false, // for static builds
    }),
  ],
});
