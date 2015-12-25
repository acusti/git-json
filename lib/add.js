var Hash = require('hashish')
module.exports = exports = function(key) {
  if (this.working[key] === undefined) {
    console.log("Cannot add. Object does not exist in working directory, please .save then retry")
    return 
  }
  this.staging[key] = Hash(this.working[key]).clone.end
  console.log("Added " + key)
}

