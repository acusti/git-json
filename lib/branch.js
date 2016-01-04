var common = require('./common')
var Hash = require('hashish')
var colors = require('ansicolors')
module.exports = exports = function(branchname) {
  this.push('branch:'+branchname+'\n')
  var result = common.parseHEAD(this.HEAD)
  if (branchname === undefined) {
    var ol = []
    Hash(this.refs).forEach(function(ref,key) {
      if (result.type == 'key') {
        if (ref === result.value) {
          ol.push({star:true, name: key, key:ref})
        } else {
          ol.push({name: key, key:ref})
        }
      } else if (result.type == 'name') {
        if (key == result.value) {
          ol.push({star:true,name:key,key:ref})
        } else {
          ol.push({name:key,key:ref})
        }
      }
    })
    var os = ''
    ol.forEach(function(item) {
      if (item.star) {
        os += colors.brightGreen('*') + ' ' + colors.yellow(item.name) + ' ' + item.key.slice(0,7)
      } else {
        os += '  ' + item.name + ' ' + item.key.slice(0,7)
      }
    })  
    console.log(os)
    return os 
  }
  if (branchname.match(/^ref:/) !== null) {
    throw new Error(branchname + " is not a valid branch name")
  }
  if (this.refs[result.value] !== undefined) {
    this.refs[branchname] = this.refs[result.value]
  }
}

