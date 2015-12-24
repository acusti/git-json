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


var parseHEAD = function(HEAD) {
  var result = HEAD.match(/^ref: refs\/heads\/(.+)/)
  if (result !== null)
    return {type:'name', value:result[1]}
  else 
    return {type:'key', value: HEAD}
}

var assignRefs = function(refs,HEAD,hash) {
  var result = parseHEAD(HEAD)
  console.log('assignRefs:', result)
  if (result.type == 'name')
    refs[result.value] = hash
  else if (result.type == 'key')
    throw new Error("assign ref feature not implemented yet")
}

var refFind = function(refs,key) {
//  console.log("RefFind: refs:", refs, " key:", key)
  var obj = Hash(refs).filter(function(val,_key) {
    return (val == key)
  }).end
  if (Object.keys(obj).length >= 1)
    return obj 
  return undefined
}

exports.log = function() {
  var os = ''
  var result = parseHEAD(this.HEAD)
  _HEAD = result.value
  for (var i = this.logs.length-1; i >= 0; i--) {
    var obj = this.logs[i]
   // console.log(obj)
    os = os.concat(colors.yellow('commit '+obj.commit))
    var found = refFind(this.refs,obj.commit)
    if (found) {
      var keys = Object.keys(found);
      if ((keys.indexOf(_HEAD) !== -1) || (_HEAD === obj.commit))
        keys.push(colors.brightBlue('HEAD')) 
      os = os.concat(colors.green(' ('))
      os = os.concat(colors.green(keys.join(',')))
      os = os.concat(colors.green(')'))
    } else {
      if (_HEAD === obj.commit) {
        os = os.concat(colors.brightBlue(' (HEAD)'))
      }
    }
    
    if (obj.parent !== undefined) {
      os = os.concat('\n').concat('parent: ' + obj.parent)
    }
    os = os.concat('\n').concat('Author: ' + obj.author)
    os = os.concat('\n').concat('Date: ' + obj.date)
    os = os.concat('\n\n').concat('    '+ obj.message).concat('\n')
  }
  console.log(os)
}
exports.init = function() {
  this.HEAD = 'ref: refs/heads/master'
  this.refs['master'] = null
}
exports.branch = function(branchname) {
  if (branchname.match(/^ref:/) !== null) {
    throw new Error(branchname + " is not a valid branch name")
  }
  var result = parseHEAD(this.HEAD)
  if (this.refs[result.value] !== undefined) {
    this.refs[branchname] = this.refs[result.value]
  }
  console.log("Created branch " + branchname,this.refs)
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
  console.log("*******\nCOMMIT: MESSAGE:", message)
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

  // parent identification
  // check if HEAD resolves to null
  var result = parseHEAD(this.HEAD)
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
  assignRefs(this.refs,this.HEAD,hash)
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
  var result = parseHEAD(this.HEAD)
  var _HEAD = result.value
  console.log("*******\nCheckout: _HEAD:", _HEAD)

  // prevent checkout if staged
  if (Object.keys(this.staging).length !== 0) {
    Hash(this.staging).forEach(function(obj,key) {
      console.log("M " + key)
    })
    return
  }
  var treehash;
  if (key === undefined) {
    var commithash = this.refs[_HEAD]
    treehash = this.commits[commithash].tree
  } else {
    // put in checkout for specific documents check first
    // check if referring to a branch switch
    if (this.refs[key] !== undefined) {
      this.HEAD = 'ref: refs/heads/'+key
      console.log("Assigned this.HEAD", this.HEAD)
      var keyhash = this.refs[key]
      treehash = this.commits[keyhash].tree
    } else if (key.length === 40) {
      // otherwise check if key is referring to a 
      // sha-key
      this.HEAD = key
      treehash = this.commits[key].tree
    }
  }
  return getTree.call(this,treehash)
}

exports.ancestor = function(branchname) {
  var branchtip = this.refs[branchname]
  if (branchtip === undefined) {
    throw new Error("No such branch exists")
  }
  var result = parseHEAD(this.HEAD)
  var key;
  if (result.type == 'name') {
    key = this.refs[result.value]
  } else if (result.type == 'key') {
    // detached headless merge
    key = result.value
  }
  var current = this.commits[key]
  if (key === branchtip) {
    return true
  }
  while (true)  {
    if (current.parent === undefined) {
      break;
    }
    if (current.parent == branchtip) {
      break;
    }
    current = this.commits[current.parent]  
  }
  return (current.parent !== undefined) && (current.parent == branchtip)
}
exports.merge = function(branchname) {
}
