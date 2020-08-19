const { buildSync } = require('esbuild')
const htmlmin = require('html-minifier')
const path = require('path')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const fs = require('fs')

const prod = process.env.NODE_ENV === 'production'
const dev = !prod

module.exports = (eleventyConfig) => {
  eleventyConfig.addWatchTarget('./src/')
  eleventyConfig.addPassthroughCopy('src/fonts')

  eleventyConfig.addNunjucksAsyncFilter('build', (filename, callback) => {
    const resolvedFilename = path.resolve(__dirname, `src/${filename}`)

    if (/\.ts$/.test(filename)) {
      callback(
        null,
        new TextDecoder('utf-8').decode(
          buildSync({
            entryPoints: [resolvedFilename],
            write: false,
            minify: prod,
            bundle: true,
          }).outputFiles[0].contents
        )
      )
    }

    if (/\.css$/.test(filename)) {
      postcss([
        tailwindcss(path.resolve(__dirname, 'tailwind.config.js')),
        ...(prod ? [autoprefixer, cssnano] : []),
      ])
        .process(fs.readFileSync(resolvedFilename, 'utf8'), { from: undefined })
        .then(({ css }) => {
          callback(null, css)
        })
    }

    if (/\.svg$/.test(filename)) {
      callback(null, fs.readFileSync(resolvedFilename, 'utf8'))
    }

    if (/\.jpg$/.test(filename)) {
      callback(
        null,
        'data:image/jpg;base64,' +
          fs.readFileSync(resolvedFilename).toString('base64')
      )
    }
  })

  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (prod && outputPath.endsWith('.html')) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
    }
    return content
  })

  return {
    dir: {
      input: 'src',
      output: 'dist',
      data: 'data',
      includes: 'includes',
    },
  }
}
