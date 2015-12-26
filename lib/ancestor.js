var common = require('./common')
// ancestor(arg1) 
// check that arg1 is an ancestor of HEAD
var ancestor = function(branchname) {
  var branchtip = this.refs[branchname]
  if (branchtip === undefined) {
    throw new Error("No such branch exists")
  }
  var result = common.parseHEAD(this.HEAD)
  var key;
  if (result.type == 'name') {
    key = this.refs[result.value]
  } else if (result.type == 'key') {
    // detached headless merge
    key = result.value
  }
  var current = this.commits[key]
  if (key === branchtip) {
    return true
  }
  while (true)  {
    if (current.parent === undefined) {
      break;
    }
    if (current.parent == branchtip) {
      break;
    }
    current = this.commits[current.parent]  
  }
  return (current.parent !== undefined) && (current.parent == branchtip)
}
module.exports = exports = ancestor
