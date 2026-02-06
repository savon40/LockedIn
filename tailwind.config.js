/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#FFF7F0',
        foreground: '#3A3A3A',
        primary: {
          DEFAULT: '#FF6600',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F5F5F5',
          foreground: '#3A3A3A',
        },
        muted: {
          DEFAULT: '#FFE5CC',
          foreground: '#7A5A3A',
        },
        accent: {
          DEFAULT: '#FF9900',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#3A3A3A',
        },
        border: '#E0E0E0',
        ring: '#FF6600',
      },
    },
  },
  plugins: [],
};
