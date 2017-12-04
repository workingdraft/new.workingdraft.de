const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const atImport = require('postcss-import')
const customProperties = require('postcss-custom-properties')
const cssnano = require('cssnano')

const DEBUG = false

const plugins = [
  atImport,
  customProperties,
  autoprefixer,
]

if (!DEBUG) {
  plugins.push(
    cssnano({
      zindex: false,
    })
  )
}

module.exports = {
  plugins,
}
