import { defineConfig, normalizePath } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { viteStaticCopy } from "vite-plugin-static-copy";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);

const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
const wasmDir = normalizePath(path.join(pdfjsDistPath, "wasm"));

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		viteStaticCopy({
			targets: [
				{
					src: wasmDir,
					dest: "",
				},
			],
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
