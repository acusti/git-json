var common = require('./common')
module.exports = exports = function(branchname) {
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
    ol.forEach(function(item) {
      if (item.star) {
        console.log(colors.brightGreen('*') + ' ' + colors.yellow(item.name) + ' ' + item.key.slice(0,7))
      } else {
        console.log('  ' + item.name + ' ' + item.key.slice(0,7))
      }
    })  
    return
  }
  if (branchname.match(/^ref:/) !== null) {
    throw new Error(branchname + " is not a valid branch name")
  }
  if (this.refs[result.value] !== undefined) {
    this.refs[branchname] = this.refs[result.value]
  }
  console.log("Created branch " + branchname,this.refs)
}

