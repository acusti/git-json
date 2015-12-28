var util = require('util')
module.exports = exports = function() {
  console.log(util.inspect(this.visualtree,{depth:null,colors:true}))
}
