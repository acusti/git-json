var uuid = require('uuid')
var jp = require('fast-json-patch')
var colors = require('ansicolors')
var Hash = require('hashish')
var genSHA = function() {
  return uuid.v4()
}
var refFind = function(refs,key) {
  var obj = Hash(refs).filter(function(val,_key) {
    return (val == key)
  }).end
  if (Object.keys(obj).length >= 1)
    return obj 
  return undefined
}

exports.log = function() {
  var os = ''
  for (var i = this.commits.length-1; i >= 0; i--) {
    var obj = this.commits[i]
    os = os.concat('* ' + colors.cyan(obj.key.slice(0,7)))
    var found = refFind(this.refs,obj.key)
    if (found) {
      var keys = Object.keys(found);
      if (keys.indexOf(this.HEAD) !== -1)
        keys.push('HEAD')
      os = os.concat(colors.yellow(' ('))
      os = os.concat(colors.yellow(keys.join(',')))
      os = os.concat(colors.yellow(')'))
    }
    os = os.concat(' ' + obj.message)
  }
  console.log(os)
}
exports.init = function() {
  this.HEAD = 'master'
  this.refs['master'] = null
}
exports.branch = function(branchname) {
//  this.refs[branchname] = 
}
exports.commit = function(message,cb) {
  if (message === undefined) 
    message = ''
  if (Object.keys(this.staging).length === 0) {
    console.log("nothing to commit")
    if (cb)
      cb(false)
    return
  }
  var key = genSHA()
  this.refs[this.HEAD] = key
  this.commits.push({key:key,message:message})
  // clear staging ({} should trigger recursive GC as = null)
  this.staging = {}
}
exports.save = function(key,obj) {
  this.working[key] = Hash(obj).clone.end
  console.log(this.working)
}
exports.add = function(key) {
  if (this.working[key] === undefined) {
    console.log("Cannot add. Object does not exist in working directory, please .save then retry")
    return 
  }
  this.staging[key] = Hash(this.working[key]).clone.end
  console.log("Added " + key)
}
