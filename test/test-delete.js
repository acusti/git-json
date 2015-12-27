var gitjson = require('../')
var git = gitjson()
var test = require('tape')

test('delete from working directory test', function(assert) {
  assert.plan(3)
  git.init()
  git.save('mydoc',{foo:'bar'})
  assert.deepEqual({foo:'bar'},git.working.mydoc)
  var isDelete = git.delete('mydoc')
  assert.equal(true,isDelete)
  assert.deepEqual({},git.working)
})
