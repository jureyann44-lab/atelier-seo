// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  site: "https://atelier-seo.fr",
  image: {
    domains: ["cdn.sanity.io"],
  },
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