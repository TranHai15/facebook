import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@components": resolve(__dirname, "src/components"),
      // eslint-disable-next-line no-undef
      "@api": resolve(__dirname, "src/api"),
      // eslint-disable-next-line no-undef
      "@contexts": resolve(__dirname, "src/contexts"),
      // eslint-disable-next-line no-undef
      "@assets": resolve(__dirname, "src/assets"),
      // eslint-disable-next-line no-undef
      "@pages": resolve(__dirname, "src/pages"),
      // eslint-disable-next-line no-undef
      "@routers": resolve(__dirname, "src/routers"),
      // eslint-disable-next-line no-undef
      "@utils": resolve(__dirname, "src/utils")
    }
  }
});
