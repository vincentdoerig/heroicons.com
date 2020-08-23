const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  experimental: {
    uniformColorPalette: true,
    extendedSpacingScale: true,
  },
  purge: {
    mode: 'all',
    content: ['src/**/*.js'],
    options: {
      keyframes: true,
    },
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        display: ['Gilroy', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'twitter-blue': '#1DA1F2',
        'purple-400-ish': '#A65FEC',
      },
      opacity: {
        10: '0.1',
        12: '0.12',
        20: '0.2',
        30: '0.3',
        40: '0.4',
      },
      maxWidth: {
        container: '112rem',
      },
    },
  },
  variants: {
    opacity: [
      'responsive',
      'hover',
      'focus',
      'group-hover',
      'focus-within',
      'group-focus-within',
    ],
    textColor: [
      'responsive',
      'hover',
      'focus',
      'group-hover',
      'group-focus-within',
    ],
    boxShadow: ['responsive', 'hover', 'focus', 'group-hover'],
    translate: ['responsive', 'hover', 'focus', 'group-hover'],
    backgroundOpacity: ['responsive', 'hover', 'focus', 'group-hover'],
    transitionDuration: [
      'responsive',
      'group-hover',
      'focus-within',
      'group-focus-within',
    ],
  },
  plugins: [
    plugin(({ addVariant, e }) => {
      addVariant('group-focus-within', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.group:focus-within .${e(
            `group-focus-within${separator}${className}`
          )}`
        })
      })
    }),
  ],
}
