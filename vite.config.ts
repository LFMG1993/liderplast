import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: '/',
    plugins: [
        react(),
        tailwindcss()
    ],

    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8787', // Apunta a tu backend de Wrangler
                changeOrigin: true,
            },
        },
    },
})
