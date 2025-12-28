// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://www.habeprod-agence.fr",
  integrations: [sitemap()],

  // ✅ AJOUTEZ CETTE SECTION
  vite: {
    build: {
      minify: "esbuild",
      rollupOptions: {
        output: {
          // Garde les assignations explicites dans les template literals
          generatedCode: {
            constBindings: true,
          },
        },
      },
    },
  },
});
