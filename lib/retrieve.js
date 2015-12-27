var _ = require('lodash')
var retrieve = function(obj,blobs) {
  var doc = {}
  Object.keys(obj).forEach(function(key) {
    var shakey = obj[key].shakey
    var blob = blobs[shakey]
    doc[key] = JSON.parse(blob.value)
  })
  return doc
}
module.exports = exports = retrieve 
