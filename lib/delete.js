var _delete = function(name) {
  this.push('delete:name:'+name+'\n')
  delete this.working[name]
  return true
}
module.exports = exports = _delete
