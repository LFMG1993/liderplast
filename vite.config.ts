import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br',
            deleteOriginFile: false // deja los archivos originales sin comprimir
        })
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8787',
                changeOrigin: true,
            },
        },
    },
    build: {
        minify: 'esbuild',
        cssCodeSplit: true,
    }
})
