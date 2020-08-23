const { createLoader } = require('simple-functional-loader')

module.exports = {
  experimental: {
    modern: true,
    polyfillsOptimization: true,
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        createLoader(function (code) {
          return code.replace(
            /"(.*?)(?<!\\)"/gs,
            (_, svg) =>
              `"${svg
                .replace(/>(\s|\\n)+</g, '><')
                .replace(/\\n$/, '')
                .replace(/<svg[^>]+>(.*?)<\/svg>/s, '$1')}"`
          )
        }),
        'raw-loader',
      ],
    })

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            name: 'static/media/[name].[hash].[ext]',
          },
        },
      ],
    })

    return config
  },
}
