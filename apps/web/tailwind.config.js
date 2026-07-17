/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pinnacle: {
          primary: '#0F3D91',
          secondary: '#0B1F3A',
          accent: '#D4AF37',
          background: '#F8FAFC',
          success: '#10B981',
          error: '#DC2626',
        }
      }
    },
  },
  plugins: [],
}
