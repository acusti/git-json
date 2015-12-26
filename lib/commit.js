var Hash = require('hashish')
var crypto = require('crypto')
var jp = require('fast-json-patch')
var common = require('./common')

var genTree = function(obj) {
  var tree = {}
  Hash(obj).forEach(function(value,key) {
    tree[key] = {type:'file-x',value:JSON.stringify(value)}
  })
  return tree
}
var genTreeSHA = function(tree) {

  // first generate sha keys and place them into obj.shakey
  Hash(tree).forEach(function(obj,name) {
    var shasum = crypto.createHash('sha1')     
    var spec = common.gitModes[obj.type].spec // blob or tree
    var str = spec.concat(' ').concat(obj.value.length).concat('\0').concat(obj.value)
    var shakey = shasum.update(str).digest('hex')
    obj.shakey = shakey
    obj.mode = common.gitModes[obj.type].mode
  })
  
  var bigTotal = 0
  
  // now generate indvidual tree buffers
  Hash(tree).forEach(function(obj,name) {
    var head_buf = new Buffer(obj.mode.concat(' ').concat(name).concat('\0'))
    var sha_buf = new Buffer(obj.shakey,'hex')
    var buffers = [head_buf,sha_buf]
    var totalLength = 0;
    for (var i = 0; i < buffers.length; i++) {
      totalLength += buffers[i].length;
    }
    var obj_buf = Buffer.concat([head_buf,sha_buf],totalLength)
    obj.obj_buf = obj_buf
    obj.buffer_length = totalLength
    bigTotal += totalLength
  })

  
  // final assembly
  // todo sort alphabetically
  // http://stackoverflow.com/questions/14790681/format-of-git-tree-object
  // per ross fellers comment "entries having references to other trees and blobs need to be sorted alphabetically by file/folder name aka path
  var buffers = []; 
  Hash(tree).forEach(function(obj,name) {
    buffers.push(obj.obj_buf)
  })
  var head_buf = new Buffer('tree '.concat(bigTotal).concat('\0'))
  // prepend head_buf
  buffers.unshift(head_buf)

  var totalLength = 0;
  for (var i = 0; i < buffers.length; i++) {
    totalLength += buffers[i].length;
  }

  var tree_buf = Buffer.concat(buffers,totalLength)
  var shasum2 = crypto.createHash('sha1')     
  return shasum2.update(tree_buf).digest('hex')
}

var genCommitString = function(commitObject) {
  var cs = ''
  cs = cs.concat('tree ').concat(commitObject['tree']).concat('\n')
  if (commitObject['parent'] !== undefined) {
    cs = cs.concat('parent ').concat(commitObject['parent']).concat('\n')
  }
  cs = cs.concat('author ').concat(commitObject['author']).concat('\n')
  cs = cs.concat('committer ').concat(commitObject['committer']).concat('\n\n')
  cs = cs.concat(commitObject['message']).concat('\n')
  return cs
}
module.exports = exports = function(message,cb) {
  if (message === undefined) 
    message = ''
  if (Object.keys(this.staging).length === 0) {
    console.log("nothing to commit")
    if (cb)
      cb(false)
    return
  }

  // we want to take current head towards staged
  // which is represented by diff(head,staged)
  
  var result = common.parseHEAD(this.HEAD)
  var current
  if ((result.type == 'name') && (this.refs[result.value] === null)) {
    // means this is first commit
  } else {
    // otherwise we can set parent
    if (result.type == 'name') {
      var key = this.refs[result.value]
      var _commit = this.commits[key]
      current = this.trees[_commit.tree] 
    } else if (result.type == 'key') {
      var _commit = this.commits[result.value]
      current = this.trees[_commit.tree] 
    }
  }
  var staged = Hash(this.staging).clone.end
  console.log("STAGED:",staged)  
  console.log("Current:",current)
//  var diff = jp.compare()

  var tree = genTree(staged)
  var treehash = genTreeSHA(tree)

  // store tree
  this.trees[treehash] = tree
  var commitObject = {}
  commitObject['tree'] = treehash

  // parent identification
  // check if HEAD resolves to null
  var result = common.parseHEAD(this.HEAD)
  if ((result.type == 'name') && (this.refs[result.value] === null)) {
    // means this is first commit
  } else {
    // otherwise we can set parent
    if (result.type == 'name') {
      commitObject['parent'] = this.refs[result.value]
    } else if (result.type == 'key') {
      commitObject['parent'] = result.value
    }
  }
  commitObject['author'] = 'David Wee <rook2pawn@gmail.com> 1450796299 -0800'
  commitObject['committer'] = 'David Wee <rook2pawn@gmail.com> 1450796299 -0800'
  commitObject['message'] = message
  var commitString = genCommitString(commitObject)
  // update commitString with the header
  commitString = 'commit '.concat(commitString.length).concat('\0').concat(commitString)

  var shasum = crypto.createHash('sha1')
  var hash = shasum.update(commitString).digest('hex')
  this.commits[hash] = commitObject
  var logC = Hash(commitObject).clone.end
  logC.commit = hash
  logC.date = new Date()
  this.logs.push(logC)
  common.assignRefs(this.refs,this.HEAD,hash)
  // clear staging ({} should trigger recursive GC as = null)
  this.staging = {}
}
