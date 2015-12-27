var lib = require('./lib')
var treelib = require('treelib')
var gitjson = function() {

  // internals
  this.refs = {}
  this.HEAD = null;
  this.commits = {}
  this.trees = {}
  this.logs = []
  this.branches = {}
  this._config = {user:{name:'Foo Bar',email:'foo@bar.com'}}

  //jsonpatch stuff
  this.repository = {}
  this.staging = {}
  this.working = {}

  // API
  this.init = lib.init  
  this.save = lib.save
  this.add = lib.add
  this.delete = lib.delete
  this.remove = lib.remove
  this.commit = lib.commit
  this.merge = lib.merge
  this.branch = lib.branch
  this.log = lib.log
  this.checkout = lib.checkout
  this.merge = lib.merge

  // API - other
  this.config = lib.config
  this.ancestor = lib.ancestor
  this.walkback = lib.walkback
}
module.exports = exports = function() {
  return new gitjson
}
