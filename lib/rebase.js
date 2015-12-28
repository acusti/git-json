var common = require('./common')
var walkback = require('./walkback')
var ancestor = require('./ancestor')
var retrieve = require('./retrieve')
var QL = require('queuelib')
var rebase = function(branchname) {
  // identify most recent common ancestor
  var result = common.parseHEAD(this.HEAD)
  var headkey
  if (result.type == 'name') {
    headkey = this.refs[result.value]
  } else if (result.type == 'key') {
    headkey = result.value
  }
  var headlist = walkback.apply(this,[headkey,true])
  var branchlist = walkback.call(this,branchname)
  var mostRecentCommonAncestor = ancestor.mostRecentCommonAncestor(headlist,branchlist)
  // now identify commit in current branch history (headlist) that points to 
  // most recent common ancestor
  var idx;
  for (var idx = 0; idx < headlist.length; idx++) {
    var key = headlist[idx]
    var commit = this.commits[key]
    if (commit.parent && (commit.parent == mostRecentCommonAncestor)) {
      break;
    }
  }
  //headslice represents the list of commits we will recommit
  // ontop of branchname
  var headslice = headlist.slice(0,idx+1).reverse()

  // checkout to branchname
  this.checkout(branchname)
  // and begin replay
  var q = new QL
  var that = this;
  headslice.forEach(function(commitkey) {
    // grab commit for key
    var commit = that.commits[commitkey]
    // grab tree from commit
    var tree = that.trees[commit.tree]
    // grab doc from tree
    var doc = retrieve(tree,that.blobs)
    // stage doc
    that.staging = doc
    that.commit.call(that,commit.message+' (rebased)')
  })
  
  // check back-out to HEAD
  this.checkout(result.value)
  
}
module.exports = exports = rebase
