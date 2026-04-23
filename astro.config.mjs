import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://docs.cs2cap.com",
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light-default",
        dark: "one-dark-pro",
      },
    },
  },
});
