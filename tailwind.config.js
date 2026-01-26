/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Be Vietnam Pro', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
        display: ['Be Vietnam Pro', 'sans-serif'],
      },
      colors: {
        brand: {
          500: 'var(--color-brand-primary)',
          600: 'var(--color-brand-secondary)',
        },
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        warning: 'var(--color-warning)',
        dark: {
          bg: 'var(--bg-app-dark)',
          card: 'var(--bg-card-dark)',
        }
      }
    },
  },
  plugins: [],
};
