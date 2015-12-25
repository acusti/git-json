var Hash = require('hashish')
module.exports = exports = function(key,obj) {
  this.working[key] = Hash(obj).clone.end
}
