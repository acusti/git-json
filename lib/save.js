var Hash = require('hashish')
module.exports = exports = function(key,obj) {
  console.log("save:key:",key,"obj:",obj)
  this.working[key] = Hash(obj).clone.end
  console.log("this.working:",this.working)
}
