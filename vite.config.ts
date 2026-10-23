import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Static build for GitHub Pages: every page is prerendered to HTML at build time.
// BASE_PATH is the sub-path the site is served from (e.g. "/mqs-advisor/").
const base = process.env["BASE_PATH"] ?? "/";

export default defineConfig({
  base,
  define: { "import.meta.env.VITE_SITE_URL": JSON.stringify(process.env["SITE_URL"] ?? "") },
  server: { port: 8080 },
  resolve: { dedupe: ["react", "react-dom", "@tanstack/react-router"] },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
      // Client-rendered fallback shell, copied to 404.html for unknown URLs.
      spa: { enabled: true, prerender: { outputPath: "/404.html", crawlLinks: false } },
      ...(process.env["SITE_URL"] && { sitemap: { enabled: true, host: process.env["SITE_URL"] } }),
    }),
    viteReact(),
  ],
});
