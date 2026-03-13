/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#2563eb', // blue-600
        'medical-blue-dark': '#1d4ed8', // blue-700
      }
    },
  },
  plugins: [],
}
