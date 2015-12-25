var common = require('./common')
var colors = require('ansicolors')
module.exports = exports = function() {
  var os = ''
  var result = common.parseHEAD(this.HEAD)
  _HEAD = result.value
  for (var i = this.logs.length-1; i >= 0; i--) {
    var obj = this.logs[i]
   // console.log(obj)
    os = os.concat(colors.yellow('commit '+obj.commit))
    var found = common.refFind(this.refs,obj.commit)
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
