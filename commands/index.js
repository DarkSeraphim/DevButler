module.exports = require('fs').readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .map(file => {console.log(file);return require('./' + file)})
  .map(cls => new cls())
