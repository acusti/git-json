var Hash = require('hashish')
var config = function(obj) {
  var that = this
  Hash(obj).forEach(function(value,key) {
    that._config[key] = value
  })
}
module.exports = exports = config
