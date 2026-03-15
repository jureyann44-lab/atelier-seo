// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "static",
  adapter: cloudflare({
    platformProxy: { enabled: true }
  }),
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
    server: {
      headers: {
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://proud-bush-8032atelier-seo-contact-form.jure-yann44.workers.dev",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
      },
    },
  },
});