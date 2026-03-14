import { defineConfig } from "vitepress";

export default defineConfig({
  title: "MindLog",
  description: "Local-first diary for your day-to-day notes.",
  lang: "en-US",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "GitHub", link: "https://github.com/aminuddin/mindlog" }
    ],
    sidebar: [
      {
        text: "Guide",
        items: [{ text: "Overview", link: "/" }]
      }
    ]
  }
});

