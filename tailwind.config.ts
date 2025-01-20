import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        primary: '#c36a2d',
        secondary: '#201f1d',
        background: '#4c4b48',
        'background-dark': '#3a3a38',
        'secondary-background': '#7e7e78',
        error: '#ff6f61',
        warning: '#c36a2d',
        success: '#00fa3c',
        'text-secondary': '#a6a6a6',
      },
    },
  },

  plugins: [],
} as Config;
