import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/Users/tiffanyhuang/Documents/Coding Projects/Wilbur/src",
    },
  },
  server: {
    port: 5173,
  },
});
