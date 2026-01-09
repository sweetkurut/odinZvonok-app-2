import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            // Все запросы, начинающиеся с /api, перенаправляем на бэкенд
            "/api": {
                target: "https://1-zvonok.com", // твой бэкенд
                changeOrigin: true,
                secure: true, // для HTTPS
                rewrite: (path) => path.replace(/^\/api/, "/api"), // опционально, если нужно
            },
        },
    },
});
