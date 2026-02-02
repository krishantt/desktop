import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("@react-pdf-viewer") || id.includes("pdfjs-dist")) {
            return "pdf-viewer";
          }
          if (id.includes("@mlc-ai/web-llm")) {
            return "web-llm";
          }
          if (
            id.includes("@xenova/transformers") ||
            id.includes("onnxruntime")
          ) {
            return "transformers";
          }
          if (id.includes("react") || id.includes("react-dom")) {
            return "react-vendor";
          }
          if (id.includes("react-router")) {
            return "router";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: "esnext",
    minify: "esbuild",
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    exclude: ["@mlc-ai/web-llm"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  define: {
    global: "globalThis",
    "process.env": "{}",
  },
  resolve: {
    alias: {
      buffer: "buffer",
      stream: "stream-browserify",
      util: "util",
    },
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    fs: {
      allow: [".."],
      strict: false,
    },
    hmr: {
      overlay: false,
    },
    host: true,
    cors: true,
  },
  preview: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "Access-Control-Allow-Origin": "*",
    },
    host: true,
    cors: true,
  },
  worker: {
    format: "es",
  },
  assetsInclude: ["**/*.wasm", "**/*.onnx", "**/*.bin"],
});
