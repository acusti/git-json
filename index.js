var lib = require('./lib')
var gitjson = function() {

  // internals
  this.refs = {}
  this.HEAD = null;
  this.commits = {}
  this.trees = {}
  this.logs = []
  this.branches = {}

  //jsonpatch stuff
  this.repository = {}
  this.staging = {}
  this.working = {}

  // API
  this.init = lib.init  
  this.add = lib.add
  this.commit = lib.commit
  this.merge = lib.merge
  this.branch = lib.branch
  this.log = lib.log
  this.checkout = lib.checkout
  this.merge = lib.merge

  // API - other
  this.save = lib.save
  this.ancestor = lib.ancestor
}
module.exports = exports = function() {
  return new gitjson
}
/*

var objA = {user: {firstName: "Albert", lastName: "Einstein"}};
var objB = {user: {firstName: "Albert", lastName: "Collins"}};
var diff = jsonpatch.compare(objA, objB)
console.log(diff)
//diff == [{op: "replace", path: "/user/lastName", value: "Collins"}]
*/
