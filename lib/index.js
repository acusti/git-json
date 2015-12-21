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
  if (this.staging.length === 0) {
    console.log("nothing to commit")
    if (cb)
      cb(false)
    return
  }
  var key = genSHA()
  this.refs[this.HEAD] = key
  this.commits.push({key:key,message:message})
}
exports.save = function(key,obj) {
  this.working[key] = Hash(obj).clone.end
}
exports.add = function(key,obj,cb) {
  if (cb === undefined) {
    cb = function() {}
  }
  if (this.working[key] !== undefined) {
    console.log("Cannot add. Object does not exist in working directory, please .save then retry")
    cb({error:"Cannot add. Object does not exist in working directory, please .save then retry"})
    return 
  }
  var diff = jp.compare(this.working[key],obj)
  if (diff.length === 0) {
    console.log("cannot add. Object in working directory differs, please .save then retry.")
    cb({error:"Cannot add. Object does not exist in working directory, please .save then retry"})
    return 
  } 
  console.log("can add")
}
