/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1F3A5F',
          50: '#F0F4F9',
          100: '#D9E2EE',
          200: '#B3C5DD',
          300: '#8DA8CC',
          400: '#678BBB',
          500: '#416EAA',
          600: '#345788',
          700: '#274166',
          800: '#1F3A5F',
          900: '#142540',
          950: '#0A1628'
        },
        gold: {
          DEFAULT: '#C9A961',
          light: '#E0C589',
          dark: '#A88A47',
          50: '#FAF6EC',
          100: '#F2E9CC',
          200: '#E5D399',
          300: '#D7BD66',
          400: '#C9A961',
          500: '#A88A47',
          600: '#876E39',
          700: '#65522B',
          800: '#43371C',
          900: '#221B0E'
        },
        cream: {
          DEFAULT: '#F4F1E8',
          50: '#FBFAF5',
          100: '#F4F1E8',
          200: '#E8E1CB'
        },
        ink: '#1A1A1A'
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #142540 0%, #1F3A5F 50%, #274166 100%)',
        'gradient-gold': 'linear-gradient(135deg, #E0C589 0%, #C9A961 50%, #A88A47 100%)',
        'gradient-radial-gold': 'radial-gradient(circle at center, rgba(201,169,97,0.18) 0%, transparent 70%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
      },
      boxShadow: {
        'gold-glow': '0 0 40px -10px rgba(201, 169, 97, 0.45)',
        'navy-soft': '0 20px 60px -20px rgba(20, 37, 64, 0.35)',
        'inset-gold': 'inset 0 0 0 1px rgba(201, 169, 97, 0.25)'
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out both',
        'fade-in': 'fadeIn 0.6s ease-out both',
        'fade-in-slow': 'fadeIn 1.2s ease-out both',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'ticker': 'ticker 40s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' }
        }
      },
      letterSpacing: {
        'super-wide': '0.3em'
      }
    }
  },
  plugins: []
};
