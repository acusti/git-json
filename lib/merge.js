var ancestor = require('./ancestor')
var common = require('./common')
module.exports = exports = function(branchname) {
  // fast forward
  if (ancestor.call(this,branchname)) {
    console.log("Can perform fast forward")
    var result = common.parseHEAD(this.HEAD)
    var key;
    if (result.type == 'name') {
      key = this.refs[result.value]
    } else if (result.type == 'key') {
      // detached headless merge
      key = result.value
    }
    this.refs[branchname] = key
  }
}
