var ancestor = require('./ancestor')
var walkback = require('./walkback')
var common = require('./common')
var merge = function(branchname) {
  // fast forward
  var result = common.parseHEAD(this.HEAD)
  if (result.type == 'name') {
    key = this.refs[result.value]
  } else if (result.type == 'key') {
    // detached headless merge
    key = result.value
  }
  if (ancestor.call(this,branchname)) {
    console.log("Can perform fast forward")
    var key;
    this.refs[branchname] = key
  } else {
    console.log("NonFF merge requested.")
    var listA = walkback.call(this,branchname)
    if (result.type == 'name') {
      var listB = walkback.call(this,result.value)
    } else {
      var listB = walkback.call(this,result.value,true)
    }
    console.log("ListA:", listA)
    console.log("ListB:", listB)
    // now we look for most recent common ancestor
    var mostRecentCommonAncestor = ancestor.mostRecentCommonAncestor(listA,listB)
    console.log("mostRecentCommonAncestor:", mostRecentCommonAncestor)
  }
}
module.exports = exports = merge
