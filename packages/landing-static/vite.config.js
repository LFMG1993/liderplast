import {defineConfig} from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
    resolve: {
        alias: {
            '@shared-assets': path.resolve(__dirname, '../../shared/assets')
        }
    },
    assetsInclude: ['**/*.svg'],
    server: {
        port: 5173,
    },
    plugins: [
        tailwindcss()
    ],
})