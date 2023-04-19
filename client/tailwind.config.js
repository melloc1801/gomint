const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      shadow: {
        gomint: {
          sm: 'box-shadow: 0 3px 4px 0px',
          md: 'box-shadow: 0 4px 12px 0px',
          lg: 'box-shadow: 0 3px 15px 0px',
          xl: 'box-shadow: 0 3px 35px 0px',
        },
      },
      transitionTimingFunction: {
        pulse: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      gridTemplateColumns: {
        sidebar: '440px 1fr',
      },
      colors: {
        blue: {
          25: '#F7FAFF',
          1000: '#0C1E54',
        },
        'gomint-blue': '#2563EB',
        'gomint-dark-blue': '#0E2361',
        'gomint-dark-grey': '#3D496F',
        'gomint-green': '#00D348',
        'gomint-grey': '#B9C3E1',
        'gomint-orange': '#FFAE10',
        'gomint-light-blue': '#FCFDFF',
        'gomint-red': '#FC573B',
        'gomint-discord': '#5865F2',
        'gomint-twitter': '#1D9BF0',
        'gomint-light-grey': '#8C9CCD',
        'gomint-requirement-common-bg': '#faf5eb',
        'gomint-requirement-discord-bg': '#F6F7FF',
        'gomint-requirement-twitter-bg': '#F6FCFF',
        'gomint-requirement-collection-bg': '#f0f4ff',
        'gomint-requirement-common-border': '#ffd587',
        'gomint-requirement-discord-border': '#AAB1FF',
        'gomint-requirement-twitter-border': '#88CFFF',
        'gomint-requirement-collection-border': '#6c92e6',
      },
      width: {
        md: '28rem',
        xl: '36rem',
        '3xl': '48rem',
        '5xl': '64rem',
        '7xl': '80rem',
      },
      height: {
        md: '28rem',
        xl: '36rem',
        '3xl': '48rem',
        '5xl': '64rem',
        '7xl': '80rem',
      },
      minWidth: {
        lg: '1024px',
      },
      minHeight: {
        24: '6rem',
        36: '9rem',
        '7xl': '80rem',
        256: '96rem',
      },
      fontSize: {
        xxs: ['10px', { lineHeight: '18px' }],
      },
      screens: {
        xs: '475px',
        ...defaultTheme.screens,
      },
      keyframes: {
        'orbitMove-5-b': {
          '0%': { transform: 'rotate(0deg) translateY(512px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translateY(512px) rotate(-360deg) ',
          },
        },
        'orbitMove-5-l': {
          '0%': { transform: 'rotate(0deg) translate(-640px, 0px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translate(-640px, 0px) rotate(-360deg) ',
          },
        },
        'orbitMove-5-rt': {
          '0%': { transform: 'rotate(0deg) translate(450px, -450px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translate(450px, -450px) rotate(-360deg) ',
          },
        },
        'orbitMove-5-r': {
          '0%': { transform: 'rotate(0deg) translateX(640px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translateX(640px) rotate(-360deg) ',
          },
        },
        'orbitMove-4-t': {
          '0%': { transform: 'rotate(0deg) translateY(-512px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translateY(-512px) rotate(-360deg) ',
          },
        },
        'orbitMove-4-lb': {
          '0%': { transform: 'rotate(0deg) translate(-350px, 350px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translate(-350px, 350px) rotate(-360deg) ',
          },
        },
        'orbitMove-4-lt': {
          '0%': { transform: 'rotate(0deg) translate(-280px, -250px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translate(-280px, -250px) rotate(-360deg) ',
          },
        },
        'orbitMove-star-1': {
          '0%': { transform: 'rotate(0deg) translate(635px, 100px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translate(635px, 100px) rotate(-360deg) ',
          },
        },
        'orbitMove-star-2': {
          '0%': { transform: 'rotate(0deg) translate(0px, 640px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translate(0px, 640px) rotate(-360deg) ',
          },
        },
        'orbitMove-star-3': {
          '0%': { transform: 'rotate(0deg) translate(355px, 150px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translate(355px, 150px) rotate(-360deg) ',
          },
        },
        'orbitMove-star-4': {
          '0%': { transform: 'rotate(0deg) translate(-532px, -350px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translate(-532px, -350px) rotate(-360deg) ',
          },
        },
        'orbitMove-star-5': {
          '0%': { transform: 'rotate(0deg) translate(-400px, 500px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translate(-400px, 500px) rotate(-360deg) ',
          },
        },
        'blue-shadow-pulse': {
          '0%': { boxShadow: '0 3px 15px 0px #2563EB' },
          '50%': { boxShadow: '0 3px 25px 0px #2563EB' },
          '100%': { boxShadow: '0 3px 15px 0px #2563EB' },
        },
        'orange-shadow-pulse': {
          '0%': { boxShadow: '0 0 1px 0 #FFAE10' },
          '50%': { boxShadow: '0 0 12px 0 #FFAE10' },
          '100%': { boxShadow: '0 0 1px 0 #FFAE10' },
        },
      },
      animation: {
        'orbitMove-5-l': 'orbitMove-5-l 600s linear infinite',
        'orbitMove-5-rt': 'orbitMove-5-rt 600s linear infinite',
        'orbitMove-5-r': 'orbitMove-5-r 600s linear infinite',
        'orbitMove-5-b': 'orbitMove-5-b 600s linear infinite',
        'orbitMove-4-lt': 'orbitMove-4-lt 800s linear infinite',
        'orbitMove-4-t': 'orbitMove-4-t 800s linear infinite',
        'orbitMove-4-lb': 'orbitMove-4-lb 800s linear infinite',
        'orbitMove-star-1': 'orbitMove-star-1 600s linear infinite',
        'orbitMove-star-2': 'orbitMove-star-2 800s linear infinite',
        'orbitMove-star-3': 'orbitMove-star-3 500s linear infinite',
        'orbitMove-star-4': 'orbitMove-star-4 600s linear infinite',
        'orbitMove-star-5': 'orbitMove-star-5 600s linear infinite',
        'blue-shadow-pulse': 'blue-shadow-pulse 4s linear infinite',
        'orange-shadow-pulse': 'orange-shadow-pulse 3s linear infinite',
      },
    },
  },
  plugins: [],
};
