var uuid = require('uuid')
var jp = require('fast-json-patch')
var colors = require('ansicolors')
var Hash = require('hashish')
var crypto = require('crypto')

var gitModes = {
  'directory' : {mode:'040000',spec:'tree'},
  'file-x'    : {mode:'100644',spec:'blob'},
  'file-x+g'  : {mode:'100664',spec:'blob'},
  'file+x'    : {mode:'100755',spec:'blob'},
  'symlink'   : {mode:'120000',spec:'tree'},
  'gitlink'   : {mode:'160000',spec:'tree'}
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
  for (var i = this.logs.length-1; i >= 0; i--) {
    var obj = this.logs[i]
    os = os.concat(colors.yellow('commit '+obj.commit))

    var found = refFind(this.refs,obj.commit)
    if (found) {
      var keys = Object.keys(found);
      if (keys.indexOf(this.HEAD) !== -1)
        keys.push('HEAD')
      os = os.concat(colors.blue(' ('))
      os = os.concat(colors.blue(keys.join(',')))
      os = os.concat(colors.blue(')'))
    }

    os = os.concat('\n').concat('Author: ' + obj.author)
    os = os.concat('\n').concat('Date: ' + obj.date)
    os = os.concat('\n\n').concat('    '+ obj.message).concat('\n')
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
    tree[key] = {type:'file-x',value:JSON.stringify(value)}
  })
  return tree
}
var genTreeSHA = function(tree) {

  // first generate sha keys and place them into obj.shakey
  Hash(tree).forEach(function(obj,name) {
    var shasum = crypto.createHash('sha1')     
    var spec = gitModes[obj.type].spec // blob or tree
    var str = spec.concat(' ').concat(obj.value.length).concat('\0').concat(obj.value)
    var shakey = shasum.update(str).digest('hex')
    obj.shakey = shakey
    obj.mode = gitModes[obj.type].mode
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
  var treehash = genTreeSHA(tree)

  // store tree
  this.trees[treehash] = tree
  var commitObject = {}
  commitObject['tree'] = treehash
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
  this.refs[this.HEAD] = hash
  // clear staging ({} should trigger recursive GC as = null)
  this.staging = {}
}
exports.save = function(key,obj) {
  this.working[key] = Hash(obj).clone.end
}
exports.add = function(key) {
  if (this.working[key] === undefined) {
    console.log("Cannot add. Object does not exist in working directory, please .save then retry")
    return 
  }
  this.staging[key] = Hash(this.working[key]).clone.end
  console.log("Added " + key)
}

var getTree = function(treehash) {
  var returnobj = {}
  Hash(this.trees[treehash]).forEach(function(obj,key) {
    console.log(key)
    returnobj[key] = JSON.parse(obj.value)
  })
  return returnobj
}

exports.checkout = function(key) {

  // prevent checkout if staged
  if (Object.keys(this.staging).length !== 0) {
    Hash(this.staging).forEach(function(obj,key) {
      console.log("M " + key)
    })
    return
  }
  if (key === undefined) {
    var commithash = this.refs[this.HEAD]
    var treehash = this.commits[commithash].tree
    return getTree.call(this,treehash)
  } else {
    var treehash = this.commits[key].tree
    return getTree.call(this,treehash)
  }
}
