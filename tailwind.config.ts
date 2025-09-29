import type {Config} from 'tailwindcss';

export default {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'liderplast': {
                    'primary': '#4a3084',
                    'hover': '#8b78b6',
                },
            },
        },
    },
    plugins: [],
} satisfies Config