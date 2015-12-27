var gitjson = require('../')
var test= require('tape')

test('config settings',function(assert) {
  assert.plan(1)
  var git = gitjson()
  git.init()
  var userdata = {user:{name:'david',email:'rook@rook.com'}}
  git.config(userdata)
  assert.deepEqual(git._config,userdata)
  git.save('mydoc',userdata)
  git.add('mydoc')
  git.commit('saved userdata')
  git.log()
})

