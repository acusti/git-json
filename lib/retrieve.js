var _ = require('lodash')
var retrieve = function(obj) {
  var doc = {}
  Object.keys(obj).forEach(function(key) {
    doc[key] = JSON.parse(obj[key].value)
  })
  return doc
}
module.exports = exports = retrieve 
