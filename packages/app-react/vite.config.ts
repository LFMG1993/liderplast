import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import viteCompression from 'vite-plugin-compression'
import path from 'path'

export default defineConfig({
    base: '/tienda/',
    plugins: [
        react(),
        tailwindcss(),
        viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br',
            deleteOriginFile: false // deja los archivos originales sin comprimir
        })
    ],
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, '../../shared'),
        },
    },
    server: {
        port: 5174,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8787',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    build: {
        minify: 'esbuild',
        cssCodeSplit: true,
    }
})
