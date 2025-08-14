import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
    base: '/admin/',
    publicDir: path.resolve(__dirname, '../../shared/assets'),
    plugins: [
        react(),
        tailwindcss()
    ],
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, '../../shared'),
        },
    },
    server: {
        port: 5175, // Puerto diferente para evitar conflictos con app-react
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8787', // Apunta a tu backend de Wrangler
                changeOrigin: true,
            },
        },
    },
})
