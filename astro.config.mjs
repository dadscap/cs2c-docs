import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://docs.cs2c.app",
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light-default",
        dark: "github-dark",
      },
    },
  },
});
