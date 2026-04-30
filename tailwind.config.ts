import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:  { DEFAULT: '#0D1B3E', light: '#1A2D5A' },
        teal:  { DEFAULT: '#009B8D', light: '#E0F5F3', dark: '#007A6E' },
        gold:  { DEFAULT: '#F5A623', light: '#FEF3DC' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
