// these are tools used in a three way merge
var jsonpatch = require('fast-json-patch')
var Hash = require('hashish')
var deepEqual = require('deep-equal')
var _ = require('lodash')
var treelib = require('treelib')
var diff = jsonpatch.compare
exports.diff = diff
var conflict = function(list) {
  var tree = treelib()
  var conflicts = []
  list.forEach(function(op) {
    var obj = tree.getValue(op.path)
    if (obj === undefined) 
      tree.path(op.path).setValue(op)
    else {
      if ((obj.op == op.op) && (obj.path == op.path)) {
        conflicts.push(obj,op)
      }
    }
  })
  return conflicts
}
exports.conflict = conflict

// reducer returns a unique list of elements from listA and list B
var reducer = function(listA,listB) {
  var reduced = _.unique(listA.concat(listB),false,function(value,idx,list) {
    return value.path + '/'+ value.op + '/' + value.value
  })
  return reduced
}
exports.reducer = reducer

var intersection = function(listA, listB, equality) {
  var intersected = []
  for (var i = 0; i < listA.length; i++) {
    var a = listA[i]
    for (var j = 0; j < listB.length; j++) {
      var b = listB[j]
      if (equality(a,b)) {
        intersected.push(b)
        break;
      }
    }
  }
  return _.unique(intersected,false,function(value,idx,list) {
    return value.path + '/'+ value.op + '/' + value.value
  })
}

// remover returns everything in listA minus equivalent
// items in listB
var remover = function(listA,listB) {
  var finalset = []
  listA.forEach(function(a) {
    var result = _.find(listB,function(b) {
      return deepEqual(a,b)
    })
    if (result === undefined) 
      finalset.push(a)
  })
  return finalset
}
exports.remover = remover

// buildTree - takes a tree and returns a new tree with identical keys but the contents of the blobs as the values
var buildTree = function(tree,blobs) {
  var newTree = {}
  Hash(tree).forEach(function(value,key) {
    var text = blobs[value.shakey].value
    newTree[key] = JSON.parse(text)
  })
  return newTree
}
exports.buildTree = buildTree

var threewaymerge = function(a,b,ancestor) {
  var diffA = diff(ancestor,a)
  var diffB = diff(ancestor,b)
  var reduced = reducer(diffA,diffB)
  var conflicts = conflict(reduced)
  var finalset = remover(reduced,conflicts)
  return {diffA:diffA,diffB,diffB,reduced:reduced,conflicts:conflicts,finalset:finalset}
}
exports.threewaymerge = threewaymerge
