/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0f766e', // Teal 700
                    light: '#2dd4bf',   // Teal 400
                    dark: '#0f5132',
                },
                background: '#f3f4f6', // Gray 100
                surface: '#ffffff',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
            }
        },
    },
    plugins: [],
}
