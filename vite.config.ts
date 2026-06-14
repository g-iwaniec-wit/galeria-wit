import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart(), nitro(), solidPlugin({ ssr: true }), devtools()],
});
