var common = require('./common')
var Hash = require('hashish')
var getTree = function(treehash) {
  var returnobj = {}
  Hash(this.trees[treehash]).forEach(function(obj,key) {
    console.log(key)
    returnobj[key] = JSON.parse(obj.value)
  })
  return returnobj
}

module.exports = exports = function(key) {
  var result = common.parseHEAD(this.HEAD)
  var _HEAD = result.value
  // prevent checkout if staged
  if (Object.keys(this.staging).length !== 0) {
    Hash(this.staging).forEach(function(obj,key) {
      console.log("M " + key)
    })
    return
  }
  var treehash;
  if (key === undefined) {
    var commithash = this.refs[_HEAD]
    treehash = this.commits[commithash].tree
  } else {
    // put in checkout for specific documents check first
    // check if referring to a branch switch
    if (this.refs[key] !== undefined) {
      this.HEAD = 'ref: refs/heads/'+key
      var keyhash = this.refs[key]
      treehash = this.commits[keyhash].tree
    } else if (key.length === 40) {
      // otherwise check if key is referring to a 
      // sha-key
      this.HEAD = key
      treehash = this.commits[key].tree
    }
  }
  return getTree.call(this,treehash)
}
