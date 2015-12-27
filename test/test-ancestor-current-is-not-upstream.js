var test = require('tape')
var gitjson = require('../index.js')
var git = gitjson()

test('is not upstream',function(assert) {
  assert.plan(2) 
  git.init()
  git.save('mydocument', {foo:'bar', val:2})
  git.add('mydocument')
  git.commit('first commit')

  git.branch('test')
  git.checkout('test')
  git.save('mydocument',{foo:'bar',val:3})
  git.add('mydocument')
  git.commit('added one to val to make it 3')

  git.save('mydocument',{foo:'bar',val:4})
  git.add('mydocument')
  git.commit('added one to val to make it 4')

  var obj = git.checkout('master')
  obj.mydocument.val = 99
  git.save('mydocument',obj.mydocument)
  git.add('mydocument')
  git.commit('commit to master val 99')

  assert.equal(false,git.ancestor('test'))
  assert.equal(true,git.ancestor('master'))
})
