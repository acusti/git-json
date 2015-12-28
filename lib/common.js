var Hash = require('hashish')
var parseHEAD = function(HEAD) {
  var result = HEAD.match(/^ref: refs\/heads\/(.+)/)
  if (result !== null)
    return {type:'name', value:result[1]}
  else 
    return {type:'key', value: HEAD}
}
exports.parseHEAD = parseHEAD

exports.assignRefs = function(refs,HEAD,hash) {
  var result = parseHEAD(HEAD)
  if (result.type == 'name')
    refs[result.value] = hash
  else if (result.type == 'key')
    throw new Error("assign ref feature not implemented yet")
}

exports.refFind = function(refs,key) {
  var obj = Hash(refs).filter(function(val,_key) {
    return (val == key)
  }).end
  if (Object.keys(obj).length >= 1)
    return obj 
  return undefined
}

exports.gitModes = {
  'directory' : {mode:'040000',spec:'tree'},
  'file-x'    : {mode:'100644',spec:'blob'},
  'file-x+g'  : {mode:'100664',spec:'blob'},
  'file+x'    : {mode:'100755',spec:'blob'},
  'symlink'   : {mode:'120000',spec:'tree'},
  'gitlink'   : {mode:'160000',spec:'tree'}
}
