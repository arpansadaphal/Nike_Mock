import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
     // "/api": "https://nike-mock.onrender.com",
      "/api": "http://127.0.0.1:8000",
      
    },
  },
});
