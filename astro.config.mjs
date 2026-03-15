// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

export default defineConfig({
  output: "static",
  adapter: netlify(),
  site: "https://atelier-seo.fr",
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/mentions-legales") &&
        !page.includes("/cgu") &&
        !page.includes("/admin"),
    }),
  ],

  vite: {
    build: {
      minify: "esbuild",
      rollupOptions: {
        output: {
          generatedCode: {
            constBindings: true,
          },
        },
      },
    },
  },
});