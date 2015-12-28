var Hash = require('hashish')
var jp = require('fast-json-patch')
var diff = jp.compare
var diffpatch = function(a,b) {
  // a represents current, b represents staged
  var new_doc = {}
  Hash(b).forEach(function(value,key) {
    if (a[key] !== undefined) {
      // important we diff from a[key] to value
      // not diff(value, a[key]) bc we want to move
      // towards staged
      var d = diff(a[key],value)
      // apply diff
      jp.apply(a[key],d)    
      new_doc[key] = a[key]
    } else {
      // new document being added (value) from staged
      new_doc[key] = value
    }
  })
  // add keyvalues from a that weren't in b at all
  Hash(a).forEach(function(value,key) {
    if (b[key] === undefined) {
      new_doc[key] = a[key]
    }
  })
  return new_doc
}
diffpatch.applyChanges = function(doc,changes) {
  var isSuccess = jp.apply(doc,changes)
  if (!isSuccess) 
    throw new Error('diffpatch.applyChanges',doc,changes)
  return doc
}
module.exports = exports = diffpatch
