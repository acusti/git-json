var Hash = require('hashish')
module.exports = exports = function(key,obj) {
  this.push('save:key:'+key+'\n')
  this.working[key] = Hash(obj).clone.end
}
