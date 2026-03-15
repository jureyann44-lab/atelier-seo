// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

const CSP_DEFAULT =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://proud-bush-8032atelier-seo-contact-form.jure-yann44.workers.dev";

const CSP_ADMIN =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://api.github.com https://raw.githubusercontent.com; frame-src https://github.com; form-action 'self' https://github.com;";

/** @type {import('vite').Plugin} */
const perRouteCsp = {
  name: "per-route-csp",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      res.setHeader(
        "Content-Security-Policy",
        req.url?.startsWith("/admin") ? CSP_ADMIN : CSP_DEFAULT
      );
      next();
    });
  },
};

export default defineConfig({
  output: "hybrid",
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
    plugins: [perRouteCsp],
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
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
      },
    },
  },
});