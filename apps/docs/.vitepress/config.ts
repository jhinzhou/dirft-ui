import { defineConfig } from "vitepress";
import markdownItContainer from "markdown-it-container";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

function normalizeBase(base: string | undefined): string {
  if (!base || base === "/") {
    return "/";
  }
  const withLeading = base.startsWith("/") ? base : `/${base}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

export default defineConfig({
  base: normalizeBase(process.env.VITEPRESS_BASE),
  title: "drift-design",
  description: "AI-ready Vue component library",
  vite: {
    resolve: {
      alias: {
        "@": resolve(currentDir, "../../../packages/ui/src")
      }
    }
  },
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Components", link: "/components/button" }
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "AI Snippets", link: "/guide/ai-snippets" }
        ]
      },
      {
        text: "Components",
        items: [
          { text: "Button", link: "/components/button" },
          { text: "Input", link: "/components/input" },
          { text: "Dialog", link: "/components/dialog" }
        ]
      }
    ],
    search: {
      provider: "local"
    }
  },
  markdown: {
    config(md) {
      md.use(markdownItContainer, "ai-snippet");
    }
  }
});
