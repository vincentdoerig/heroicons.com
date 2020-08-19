const path = require('path')
const fs = require('fs')
const tags = require('./iconTags')

const baseDirectory = path.resolve(__dirname, '../../node_modules/heroicons')

function getIcons(dir, style) {
  return fs.readdirSync(dir).map((filename) => {
    let name = filename.replace(/\.svg$/, '')
    let size = style === 'small' ? 20 : 24
    return {
      name,
      style,
      new: (tags[name] || []).includes('new'),
      svg: fs
        .readFileSync(path.resolve(dir, filename), 'utf8')
        .replace('<svg', `<svg width="${size}" height="${size}"`),
    }
  })
}

module.exports = () => {
  const medium = getIcons(path.resolve(baseDirectory, 'outline'), 'medium')
  const small = getIcons(path.resolve(baseDirectory, 'solid'), 'small')

  return {
    count: medium.length,
    medium,
    small,
  }
}
