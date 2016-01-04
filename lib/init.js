module.exports = exports = function() {
  this.push('init:\n')
  this.HEAD = 'ref: refs/heads/master'
  this.refs['master'] = null
}
