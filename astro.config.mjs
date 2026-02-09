// @ts-check
import { defineConfig } from "astro/config";
// import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  site: "https://www.habeprod-agence.fr",

  // ❌ On désactive le sitemap pour test
  integrations: [],

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
