var common = require('./common')
var walkback = require('./walkback')
var _ = require('lodash')
// Returns true if branchname is ancestor of HEAD
var ancestor = function(branchname,isKey) {
  var result = common.parseHEAD(this.HEAD)
  if ((result.type == 'name') && (this.refs[result.value] === null)) {
    throw new Error('there are no commits')
    return
  }
  var list
  if (result.type == 'name') {
    list = walkback.apply(this,[result.value,false])
  } else {
    list = walkback.apply(this,[result.value,true])
  }
  var key
  if (isKey)
    key = branchname
  else 
    key = this.refs[branchname]
  return _.includes(list,key)
}
// utility function for threeway merge
// note that listA and listB should be 
// in the order provided from walkback
// that is, the first entry is the most recent and
// the last entry is the earliest entry
ancestor.mostRecentCommonAncestor = function(listA,listB) {
  var mostRecentCommonAncestor;

  for (var i = 0; i < listA.length; i++) {
    var a = listA[i]
    for (var j = 0; j < listB.length; j++) {
      var b = listB[j]
      if (a == b) {
        mostRecentCommonAncestor = a
        break
      }
    }
    if (mostRecentCommonAncestor !== undefined)
      break
  }
  return mostRecentCommonAncestor
}
module.exports = exports = ancestor
