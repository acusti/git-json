var gitjson = require('./index.js')
var assert = require('assert')
var git = gitjson()

  git.init()
  git.save('mydocument', {foo:'bar', val:2})
  git.add('mydocument')
  git.commit('first commit')

  git.branch('test')
  git.checkout('test')
  git.save('mydocument',{foo:'bar',val:3})
  git.add('mydocument')
  git.commit('added one to val to make it 3')

  git.log()

  var obj = git.checkout('master')
  obj.mydocument.val = 99
  git.save('mydocument',obj)
  git.add('mydocument')
  git.commit('commit to master val 99')

  git.log()
  assert.equal(false,git.ancestor('test'))
  assert.equal(true,git.ancestor('master'))
  
  git.merge('test')
  
