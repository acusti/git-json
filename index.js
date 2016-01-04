var inherits = require('inherits');
var Duplex = require('readable-stream').Duplex;
var lib = require('./lib')
var treelib = require('treelib')

inherits(GitJSON, Duplex);

module.exports = exports = GitJSON

function GitJSON() {
  if (!(this instanceof GitJSON)) return new GitJSON;
//  var self = this;
  Duplex.call(this);
  this.on('finish', function () {
  });
  // internals
  this.refs = {}
  this.HEAD = null;
  this.commits = {}
  this.blobs = {}
  this.trees = {}
  this.logs = []
  this.branches = {}
  this._config = {user:{name:'Foo Bar',email:'foo@bar.com'}}
  // internals - extra
  this.visualtree = {}
  this.visualtreekey = []

  this.repository = {}
  this.staging = {}
  this.working = {}
}

// API
GitJSON.prototype.init = lib.init
GitJSON.prototype.save = lib.save
GitJSON.prototype.add = lib.add
GitJSON.prototype.delete = lib.delete
GitJSON.prototype.remove = lib.remove
GitJSON.prototype.commit = lib.commit
GitJSON.prototype.merge = lib.merge
GitJSON.prototype.branch = lib.branch
GitJSON.prototype.log = lib.log
GitJSON.prototype.checkout = lib.checkout
GitJSON.prototype.merge = lib.merge
GitJSON.prototype.rebase = lib.rebase


// API - other
GitJSON.prototype.config = lib.config
GitJSON.prototype.ancestor = lib.ancestor
GitJSON.prototype.walkback = lib.walkback
GitJSON.prototype.visual = lib.visual


GitJSON.prototype._write = function (buf, enc, next) {
};

GitJSON.prototype._read = function () {
};
