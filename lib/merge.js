var ancestor = require('./ancestor')
var walkback = require('./walkback')
var tools = require('./threewaymerge')
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
    // now construct the three trees, a, b, ancestor
    // then 
    // first generate two diff sets (ancestor->a), (ancestor->b)
    // reduce two changes that are identical to one change (REDUCER)
    // identify the conflicts from the reduced set (CONFLICTS)
    // create a final clean set  (REMOVER)
    // if no conflicts, apply clean set, if conflicts ... 

    var a_commit = this.commits[listA[0]]
    var b_commit = this.commits[listB[0]] 
    var ancestor_commit = this.commits[mostRecentCommonAncestor]
    console.log("a_commit (from branchname " + branchname +"):", a_commit)
    console.log("b_commit:", b_commit)
    var a_tree = this.trees[a_commit.tree]    
    var b_tree = this.trees[b_commit.tree]    
    var ancestor_tree = this.trees[ancestor_commit.tree]
    console.log("a_tree:", a_tree)
    console.log("b_tree:", b_tree)
    console.log("ancestor_tree:", ancestor_tree)
    var a_data = tools.buildTree(a_tree,this.blobs)
    var b_data = tools.buildTree(b_tree,this.blobs)
    var ancestor_data = tools.buildTree(ancestor_tree,this.blobs)
    console.log("a:",a_data)
    console.log("b:",b_data)
    console.log("ancestor:",ancestor_data)
    var results = tools.threewaymerge(a_data,b_data,ancestor_data)
    return results
  }
}
module.exports = exports = merge
