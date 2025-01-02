import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ],
  server: {
    proxy: {
      "/__": {
        target: "https://gs-on-a-budget.firebaseapp.com", // Replace with your Firebase project URL
        changeOrigin: true,
        secure: false,
      },
      "/firebase-storage": {
        target: "https://firebasestorage.googleapis.com", // Firebase Storage URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/firebase-storage/, ""), // Remove /firebase-storage from the path
      },
    },
  },
});
