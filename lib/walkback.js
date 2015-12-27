var common = require('./common')
// walks back through commit history
// for a given branch
var walkback = function(branchname,isKey) {
  if (!isKey) {
    var branchtip = this.refs[branchname]
    if (branchtip === undefined) {
      throw new Error("No such branch exists")
    }
  } else {
    // refers to the sha-key of commit
    var branchtip = branchname 
  }
  var list = []
  list.push(branchtip)
  var current = this.commits[branchtip]
  while (true)  {
    if (current.parent === undefined) {
      break;
    }
    list.push(current.parent)
    current = this.commits[current.parent]  
  }
  // list is now comprised of commit hashes
  // where list[0] is the latest commit from branchname
  // till it hits the root, the end element of list
  return list
}
module.exports = exports = walkback
