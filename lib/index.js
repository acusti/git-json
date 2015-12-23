var uuid = require('uuid')
var jp = require('fast-json-patch')
var colors = require('ansicolors')
var Hash = require('hashish')
var crypto = require('crypto')

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

var genTree = function(obj) {
  var tree = {}
  Hash(obj).forEach(function(value,key) {
    var shasum = crypto.createHash('sha1')     
    var text = ''; //JSON.stringify(value)
    var data_buf = new Buffer(text, "utf8"); 
    var blob_buf = new Buffer(256); 
    blob_buf.fill(0)
    blob_buf.write("blob "+data_buf.length.toString()); 
    blob_buf.writeUInt8(0,5+data_buf.length+1); 
    blob_buf.write(data_buf.toString(),5+data_buf.length+1+1); 
console.log(blob_buf.toString())
//var hash_buf = shasum.update(data_buf.toString(),'utf8').digest("hex");
//console.log(hash_buf)
//    var shakey = shasum.update('blob '.concat(text.length).concat('\0').concat(text)).digest('hex')
//tree[hash_buf.toString()] =  value
  })
  return tree
}
var genTreeSHA = function(tree) {
  console.log('genTreeSHA',tree)
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
  var staged = Hash(this.staging).clone.end
  var tree = genTree(staged)
  var key = genTreeSHA(tree)
  this.refs[this.HEAD] = key
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
